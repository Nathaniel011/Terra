import { DatePipe } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { PredioMockService } from '../../../data-access/mock/predio-mock.service'
import { ValoracionMockService } from '../../../data-access/mock/valoracion-mock.service'
import { ValuacionAnual } from '../../../data-access/mock/catastro.model'

type ModoVal = 'individual' | 'masivo' | 'consulta' | 'secundarias'

@Component({
  selector: 'terra-valoracion-page',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './valoracion.page.html',
  styleUrl: './valoracion.page.scss',
})
export class ValoracionPage {
  readonly predios = inject(PredioMockService)
  readonly valuacion = inject(ValoracionMockService)

  readonly modo = signal<ModoVal>('individual')
  readonly anioGestion = signal(2026)
  readonly codigo = signal('008-0042-004-00')
  readonly ultimo = signal<ValuacionAnual | null>(null)
  readonly resultadosMasivo = signal<ValuacionAnual[]>([])
  readonly mensaje = signal('')
  readonly detalleAbierto = signal<string | null>(null)

  secTipo = 'Mejora'
  secDesc = ''
  secMonto = 0

  readonly consultaLista = computed(() => this.valuacion.porAnio(this.anioGestion()))

  readonly secundariasLista = computed(() =>
    this.valuacion.secundariasDe(this.codigo(), this.anioGestion()),
  )

  setModo(m: ModoVal) {
    this.modo.set(m)
    this.mensaje.set('')
  }

  factoresProducto(u: ValuacionAnual): string {
    const fs = u.detalleTerreno.factores.map((f) => f.valor)
    return fs.length ? fs.join(' × ') : '1'
  }

  calcularIndividual() {
    try {
      const r = this.valuacion.calcularIndividual(this.codigo(), this.anioGestion())
      this.ultimo.set(r)
      this.mensaje.set(
        `Cálculo individual ${r.codigoCatastral} · gestión ${r.anioGestion} — Vi = ${this.money(r.vi)}`,
      )
    } catch (e) {
      this.ultimo.set(null)
      this.mensaje.set(e instanceof Error ? e.message : 'Error en el cálculo')
    }
  }

  aplicarIndividual() {
    const ok = this.valuacion.aplicarAUnidad(this.codigo(), this.anioGestion())
    this.mensaje.set(
      ok
        ? 'Valores Vt / Vc / Vi aplicados a la ficha de la unidad.'
        : 'Debe calcular primero la valuación de este año.',
    )
  }

  calcularMasivo() {
    const ok = confirm(
      `¿Ejecutar cálculo masivo para el año de gestión ${this.anioGestion()}?\nSe recalcularán todas las unidades catastrales.`,
    )
    if (!ok) return
    try {
      const results = this.valuacion.calcularMasivo(this.anioGestion())
      this.resultadosMasivo.set(results)
      this.mensaje.set(`Cálculo masivo: ${results.length} unidades valuadas.`)
    } catch (e) {
      this.resultadosMasivo.set([])
      this.mensaje.set(e instanceof Error ? e.message : 'Error en cálculo masivo')
    }
  }

  aplicarMasivo() {
    const n = this.valuacion.aplicarMasivo(this.anioGestion())
    this.mensaje.set(`Se actualizaron ${n} fichas con los valores del año ${this.anioGestion()}.`)
  }

  toggleDetalle(codigo: string) {
    this.detalleAbierto.update((c) => (c === codigo ? null : codigo))
  }

  agregarSecundaria() {
    if (!this.secDesc.trim() || this.secMonto <= 0) {
      this.mensaje.set('Complete descripción y monto de la valoración secundaria.')
      return
    }
    this.valuacion.agregarSecundaria({
      codigoCatastral: this.codigo(),
      tipo: this.secTipo,
      descripcion: this.secDesc.trim(),
      monto: this.secMonto,
      anioGestion: this.anioGestion(),
    })
    this.secDesc = ''
    this.secMonto = 0
    this.mensaje.set('Valoración secundaria registrada.')
  }

  money(v: number) {
    return this.predios.formatMoney(v)
  }
}
