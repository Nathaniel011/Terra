import { Injectable, computed, inject, signal } from '@angular/core'
import { DatosContribuyente, Predio } from './catastro.model'
import { SEED_PREDIOS } from './catastro.seed'
import { CatalogoMockService } from './catalogo-mock.service'
import { aplicarValoresOficiales } from './valoracion.engine'

@Injectable({ providedIn: 'root' })
export class PredioMockService {
  private readonly catalogos = inject(CatalogoMockService)

  private readonly predios = signal<Predio[]>(this.seedConValuacionOficial())
  private readonly query = signal('')

  readonly all = this.predios.asReadonly()

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase()
    const list = this.predios()
    if (!q) return list
    return list.filter(
      (p) =>
        p.codigoCatastral.toLowerCase().includes(q) ||
        p.propietario.toLowerCase().includes(q) ||
        p.calle.toLowerCase().includes(q) ||
        p.zonaMunicipal.toLowerCase().includes(q),
    )
  })

  setQuery(value: string) {
    this.query.set(value)
  }

  byCodigo(codigo: string): Predio | undefined {
    return this.predios().find((p) => p.codigoCatastral === codigo)
  }

  updateContribuyente(codigo: string, data: DatosContribuyente): void {
    this.predios.update((list) =>
      list.map((p) =>
        p.codigoCatastral === codigo
          ? {
              ...p,
              contribuyente: { ...data },
              propietario: data.nombre,
              codigoPropietario: data.codigoPropietario,
            }
          : p,
      ),
    )
  }

  updatePredio(codigo: string, patch: Partial<Predio>): void {
    this.predios.update((list) =>
      list.map((p) => (p.codigoCatastral === codigo ? { ...p, ...patch } : p)),
    )
  }

  formatMoney(value: number): string {
    return (
      value.toLocaleString('es-BO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + ' Bs.'
    )
  }

  /** Recalcula y aplica valores oficiales a todas las unidades. */
  sincronizarValoresOficiales(anioGestion = 2026): void {
    this.predios.update((list) =>
      list.map((p) =>
        aplicarValoresOficiales(
          p,
          anioGestion,
          this.catalogos.zonasSuelos(),
          this.catalogos.factoresPendiente(),
          this.catalogos.factoresDepreciacion(),
          this.catalogos.tipologias(),
        ),
      ),
    )
  }

  private seedConValuacionOficial(): Predio[] {
    return SEED_PREDIOS.map((p) =>
      aplicarValoresOficiales(
        structuredClone(p),
        2026,
        this.catalogos.zonasSuelos(),
        this.catalogos.factoresPendiente(),
        this.catalogos.factoresDepreciacion(),
        this.catalogos.tipologias(),
      ),
    )
  }
}
