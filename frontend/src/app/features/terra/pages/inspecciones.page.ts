import { Component, computed, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { InspeccionMockService } from '../../../data-access/mock/inspeccion-mock.service'

@Component({
  selector: 'terra-inspecciones-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inspecciones.page.html',
  styleUrl: './inspecciones.page.scss',
})
export class InspeccionesPage {
  readonly data = inject(InspeccionMockService)
  readonly selectedDay = signal(14)

  readonly mesLabel = computed(() => {
    const { year, month } = this.data.periodo()
    return new Date(year, month, 1).toLocaleDateString('es-BO', {
      month: 'long',
      year: 'numeric',
    })
  })

  readonly calendarDays = computed(() => {
    const { year, month } = this.data.periodo()
    const first = new Date(year, month, 1)
    const startPad = (first.getDay() + 6) % 7 // lunes=0
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: Array<number | null> = []
    for (let i = 0; i < startPad; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  })

  readonly delDia = computed(() => {
    const day = this.selectedDay()
    return this.data.delMes().filter((i) => {
      const d = new Date(i.fecha + 'T12:00:00')
      return d.getDate() === day
    })
  })

  formatFecha(iso: string): string {
    const d = new Date(iso + 'T12:00:00')
    return d.toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  dayStatus(day: number | null) {
    if (day == null) return null
    return this.data.diasConEstado().get(day) ?? null
  }

  programar() {
    const { year, month } = this.data.periodo()
    const day = this.selectedDay()
    const fecha = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    this.data.agregar({
      fecha,
      hora: '10:00',
      codigoCatastral: '008-0042-004-00',
      propietario: 'Condori Apaza Pedro',
      inspector: 'Lic. Carlos Mamani',
      tipo: 'Verificación',
      estado: 'PROGRAMADA',
    })
  }
}
