import { Injectable, computed, inject, signal } from '@angular/core'
import { ValuacionAnual, ValoracionSecundaria } from './catastro.model'
import { CatalogoMockService } from './catalogo-mock.service'
import { PredioMockService } from './predio-mock.service'
import { calcularValuacion, calculoMasivo, ValuacionCatalogError } from './valoracion.engine'

const STORE_KEY = 'terra.valuaciones.v1'
const SEC_KEY = 'terra.valuaciones.secundarias.v1'

/**
 * Valuaciones por código catastral y año de gestión.
 */
@Injectable({ providedIn: 'root' })
export class ValoracionMockService {
  private readonly predios = inject(PredioMockService)
  private readonly catalogos = inject(CatalogoMockService)

  private readonly valuaciones = signal<ValuacionAnual[]>(this.readStore())
  private readonly secundarias = signal<ValoracionSecundaria[]>(this.readSecundarias())

  readonly all = this.valuaciones.asReadonly()
  readonly secundariasAll = this.secundarias.asReadonly()

  readonly aniosDisponibles = computed(() => {
    const years = new Set(this.valuaciones().map((v) => v.anioGestion))
    years.add(new Date().getFullYear())
    years.add(2026)
    years.add(2025)
    return [...years].sort((a, b) => b - a)
  })

  porUnidad(codigo: string, anio?: number): ValuacionAnual[] {
    return this.valuaciones()
      .filter((v) => v.codigoCatastral === codigo && (anio == null || v.anioGestion === anio))
      .sort((a, b) => b.anioGestion - a.anioGestion)
  }

  porAnio(anio: number): ValuacionAnual[] {
    return this.valuaciones()
      .filter((v) => v.anioGestion === anio)
      .sort((a, b) => a.codigoCatastral.localeCompare(b.codigoCatastral))
  }

  /** Avalúo de una unidad */
  calcularIndividual(codigo: string, anioGestion: number): ValuacionAnual {
    const predio = this.predios.byCodigo(codigo)
    if (!predio) throw new ValuacionCatalogError(`Unidad ${codigo} no encontrada`)
    const result = calcularValuacion(
      predio,
      anioGestion,
      this.catalogos.zonasSuelos(),
      this.catalogos.factoresPendiente(),
      this.catalogos.factoresDepreciacion(),
      this.catalogos.tipologias(),
    )
    this.upsert(result)
    return result
  }

  /** Avalúo de todas las unidades del año */
  calcularMasivo(anioGestion: number): ValuacionAnual[] {
    const results = calculoMasivo(
      this.predios.all(),
      anioGestion,
      this.catalogos.zonasSuelos(),
      this.catalogos.factoresPendiente(),
      this.catalogos.factoresDepreciacion(),
      this.catalogos.tipologias(),
    )
    for (const r of results) this.upsert(r)
    return results
  }

  aplicarAUnidad(codigo: string, anioGestion: number): boolean {
    const v = this.porUnidad(codigo, anioGestion)[0]
    if (!v) return false
    this.predios.updatePredio(codigo, {
      valorTerreno: v.vt,
      valorConstruccion: v.vc,
      valorCatastral: v.vi,
    })
    return true
  }

  aplicarMasivo(anioGestion: number): number {
    let n = 0
    for (const v of this.porAnio(anioGestion)) {
      if (this.aplicarAUnidad(v.codigoCatastral, anioGestion)) n++
    }
    return n
  }

  agregarSecundaria(parcial: Omit<ValoracionSecundaria, 'id'>): void {
    this.secundarias.update((list) => {
      const next = [{ ...parcial, id: `vs-${Date.now()}` }, ...list]
      this.writeSecundarias(next)
      return next
    })
  }

  eliminarSecundaria(id: string): void {
    this.secundarias.update((list) => {
      const next = list.filter((s) => s.id !== id)
      this.writeSecundarias(next)
      return next
    })
  }

  secundariasDe(codigo: string, anio?: number): ValoracionSecundaria[] {
    return this.secundarias().filter(
      (s) => s.codigoCatastral === codigo && (anio == null || s.anioGestion === anio),
    )
  }

  private upsert(result: ValuacionAnual): void {
    this.valuaciones.update((list) => {
      const next = list.filter(
        (v) =>
          !(v.codigoCatastral === result.codigoCatastral && v.anioGestion === result.anioGestion),
      )
      next.push(result)
      this.writeStore(next)
      return next
    })
  }

  private readStore(): ValuacionAnual[] {
    try {
      const raw = localStorage.getItem(STORE_KEY)
      if (raw) return JSON.parse(raw) as ValuacionAnual[]
    } catch {
      /* ignore */
    }
    return []
  }

  private writeStore(list: ValuacionAnual[]): void {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(list))
    } catch {
      /* ignore */
    }
  }

  private readSecundarias(): ValoracionSecundaria[] {
    try {
      const raw = localStorage.getItem(SEC_KEY)
      if (raw) return JSON.parse(raw) as ValoracionSecundaria[]
    } catch {
      /* ignore */
    }
    return [
      {
        id: 'vs-1',
        codigoCatastral: '008-0042-004-00',
        tipo: 'Mejora no capitalizable',
        descripcion: 'Cierre perimetral provisional',
        monto: 3500,
        anioGestion: 2026,
      },
    ]
  }

  private writeSecundarias(list: ValoracionSecundaria[]): void {
    try {
      localStorage.setItem(SEC_KEY, JSON.stringify(list))
    } catch {
      /* ignore */
    }
  }
}
