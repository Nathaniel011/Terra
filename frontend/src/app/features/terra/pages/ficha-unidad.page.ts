import { Component, computed, effect, inject, input, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { DatosContribuyente } from '../../../data-access/mock/catastro.model'
import { PredioMockService } from '../../../data-access/mock/predio-mock.service'
import { CatalogoMockService } from '../../../data-access/mock/catalogo-mock.service'
import { ValoracionMockService } from '../../../data-access/mock/valoracion-mock.service'
import { codigoSueloFromTipo } from '../../../data-access/mock/valoracion.engine'

type FichaTab =
  | 'generales'
  | 'superficies'
  | 'construcciones'
  | 'valoraciones'
  | 'propietarios'
  | 'transferencias'
  | 'usos'
  | 'otros'

@Component({
  selector: 'terra-ficha-unidad-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './ficha-unidad.page.html',
  styleUrl: './ficha-unidad.page.scss',
})
export class FichaUnidadPage {
  readonly codigo = input.required<string>()
  readonly data = inject(PredioMockService)
  readonly catalogos = inject(CatalogoMockService)
  readonly valuacionSvc = inject(ValoracionMockService)

  readonly tab = signal<FichaTab>('generales')
  readonly saved = signal(false)
  readonly draft = signal<DatosContribuyente | null>(null)

  readonly predio = computed(() => this.data.byCodigo(this.codigo()))

  readonly zonaSuelo = computed(() => {
    const p = this.predio()
    if (!p) return undefined
    const suelo = codigoSueloFromTipo(p.tipoSuelo)
    return this.catalogos
      .zonasSuelos()
      .find((z) => z.codigoZona === p.zona && z.codigoSuelo === suelo)
  })

  readonly ultimaValuacion = computed(() => this.valuacionSvc.porUnidad(this.codigo())[0] ?? null)

  constructor() {
    effect(() => {
      const p = this.predio()
      if (p) this.draft.set({ ...p.contribuyente })
      else this.draft.set(null)
    })
  }

  setTab(t: FichaTab) {
    this.tab.set(t)
    this.saved.set(false)
  }

  saveContrib(codigo: string) {
    const d = this.draft()
    if (!d) return
    this.data.updateContribuyente(codigo, d)
    this.saved.set(true)
  }

  money(v: number) {
    return this.data.formatMoney(v)
  }

  usoLabel(p: { usoPrimario?: string; uso: string }) {
    if (p.usoPrimario) return p.usoPrimario
    if (p.uso === 'comercial') return 'Comercial'
    if (p.uso === 'verde') return 'Área verde'
    return 'Residencial'
  }
}
