import { Injectable, computed, signal } from '@angular/core'
import { Inspeccion } from './catastro.model'
import { SEED_INSPECCIONES } from './catastro.seed'

@Injectable({ providedIn: 'root' })
export class InspeccionMockService {
  private readonly inspecciones = signal<Inspeccion[]>(structuredClone(SEED_INSPECCIONES))
  private readonly mes = signal({ year: 2026, month: 6 }) // julio 0-indexed

  readonly all = this.inspecciones.asReadonly()
  readonly periodo = this.mes.asReadonly()

  readonly delMes = computed(() => {
    const { year, month } = this.mes()
    return this.inspecciones()
      .filter((i) => {
        const d = new Date(i.fecha + 'T12:00:00')
        return d.getFullYear() === year && d.getMonth() === month
      })
      .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora))
  })

  readonly diasConEstado = computed(() => {
    const map = new Map<number, 'PROGRAMADA' | 'COMPLETADA' | 'MIXTO'>()
    for (const i of this.delMes()) {
      const day = new Date(i.fecha + 'T12:00:00').getDate()
      const prev = map.get(day)
      if (!prev) map.set(day, i.estado === 'COMPLETADA' ? 'COMPLETADA' : 'PROGRAMADA')
      else if (prev !== i.estado && i.estado !== 'CANCELADA') map.set(day, 'MIXTO')
    }
    return map
  })

  agregar(parcial: Omit<Inspeccion, 'id'>): void {
    const id = `ins-${Date.now()}`
    this.inspecciones.update((list) => [...list, { ...parcial, id }])
  }
}
