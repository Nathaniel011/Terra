import {
  FactorDepreciacion,
  FactorPendienteCatalogo,
  PlantaConstruccion,
  Predio,
  TipologiaVivienda,
  ValuacionAnual,
  ZonaSuelo,
} from './catastro.model'

/**
 * Motor de valuación catastral.
 *
 * Vt = (área_básica × ValorSuelo + excedente × ValorExcedente) × ∏ Fi_terreno
 * Vc_i = Ac × Crmc × Fi_depreciacion
 * Vc = Σ Vc_i
 * Vi = Vt + Vc
 */
export class ValuacionCatalogError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValuacionCatalogError'
  }
}

export function codigoSueloFromTipo(tipo: Predio['tipoSuelo']): string {
  if (tipo === 'CEMENTO') return 'C'
  if (tipo === 'TIERRA') return 'T'
  return 'M'
}

export function resolveTipologiaCodigo(
  planta: PlantaConstruccion,
  tipologias: TipologiaVivienda[],
): TipologiaVivienda | undefined {
  if (planta.codigoTipologia) {
    const byCode = tipologias.find((t) => t.codigo === planta.codigoTipologia)
    if (byCode) return byCode
  }
  const name = planta.tipologia.toLowerCase()
  return tipologias.find((t) => t.nombre.toLowerCase() === name)
}

export function lookupDepreciacion(
  anos: number,
  tabla: FactorDepreciacion[],
): FactorDepreciacion {
  const sorted = [...tabla].sort((a, b) => b.cantidadAnos - a.cantidadAnos)
  return sorted.find((r) => r.cantidadAnos <= anos) ?? { cantidadAnos: 0, valor: 1 }
}

export function calcularValuacion(
  predio: Predio,
  anioGestion: number,
  zonas: ZonaSuelo[],
  pendientes: FactorPendienteCatalogo[],
  depreciaciones: FactorDepreciacion[],
  tipologias: TipologiaVivienda[],
  factoresTerrenoExtra: Array<{ nombre: string; valor: number }> = [],
): ValuacionAnual {
  const codigoSuelo = codigoSueloFromTipo(predio.tipoSuelo)
  const zona = zonas.find((z) => z.codigoZona === predio.zona && z.codigoSuelo === codigoSuelo)

  if (!zona) {
    throw new ValuacionCatalogError(
      `No hay tarifa de zona/suelo para zona=${predio.zona} suelo=${codigoSuelo} (${predio.codigoCatastral})`,
    )
  }

  const valorSuelo = zona.valorSuelo
  const valorExcedenteTarifa = zona.valorExcedente
  const excedente = Math.max(0, predio.frentes.excedente ?? 0)
  const areaTotal = predio.superficieTerreno
  const areaBasica = Math.max(0, areaTotal - excedente)

  const vtBruto = areaBasica * valorSuelo + excedente * valorExcedenteTarifa

  const fpRow = pendientes.find((f) => f.gradoInclinacion === predio.pendiente)
  if (!fpRow) {
    throw new ValuacionCatalogError(
      `FactorPendiente no encontrado para grado=${predio.pendiente} (${predio.codigoCatastral})`,
    )
  }

  const factores: Array<{ nombre: string; valor: number }> = [
    { nombre: 'Factor pendiente', valor: fpRow.valorFactor },
    ...factoresTerrenoExtra.filter((f) => f.valor !== 0),
  ]

  const vt = factores.reduce((acc, f) => acc * f.valor, vtBruto)

  const detalleConstrucciones = predio.plantas.map((pl) => {
    const tip = resolveTipologiaCodigo(pl, tipologias)
    if (!tip) {
      throw new ValuacionCatalogError(
        `Tipología no encontrada para planta ${pl.nombrePlanta} (${predio.codigoCatastral})`,
      )
    }
    const crmc = pl.propiedadHorizontal ? tip.valorPropiedadHorizontal : tip.valorUnifamiliar
    const dep = lookupDepreciacion(pl.antiguedad, depreciaciones)
    const vc = pl.superficiePlanta * crmc * dep.valor
    return {
      numeroConstruccion: pl.numeroConstruccion,
      numeroPlanta: pl.numeroPlanta,
      nombrePlanta: pl.nombrePlanta,
      ac: pl.superficiePlanta,
      crmc,
      fi: dep.valor,
      vc,
      antiguedad: pl.antiguedad,
    }
  })

  const vc = detalleConstrucciones.reduce((s, d) => s + d.vc, 0)

  return {
    codigoCatastral: predio.codigoCatastral,
    anioGestion,
    vt: round2(vt),
    vc: round2(vc),
    vi: round2(vt + vc),
    fechaCalculo: new Date().toISOString(),
    detalleTerreno: {
      areaTotal,
      areaBasica,
      excedente,
      valorSuelo,
      valorExcedente: valorExcedenteTarifa,
      vtBruto: round2(vtBruto),
      factores,
    },
    detalleConstrucciones: detalleConstrucciones.map((d) => ({
      ...d,
      vc: round2(d.vc),
    })),
  }
}

export function calculoMasivo(
  predios: Predio[],
  anioGestion: number,
  zonas: ZonaSuelo[],
  pendientes: FactorPendienteCatalogo[],
  depreciaciones: FactorDepreciacion[],
  tipologias: TipologiaVivienda[],
): ValuacionAnual[] {
  return predios.map((p) =>
    calcularValuacion(p, anioGestion, zonas, pendientes, depreciaciones, tipologias),
  )
}

/** Aplica Vt/Vc/Vi calculados a la ficha del predio. */
export function aplicarValoresOficiales(
  predio: Predio,
  anioGestion: number,
  zonas: ZonaSuelo[],
  pendientes: FactorPendienteCatalogo[],
  depreciaciones: FactorDepreciacion[],
  tipologias: TipologiaVivienda[],
): Predio {
  const v = calcularValuacion(predio, anioGestion, zonas, pendientes, depreciaciones, tipologias)
  const plantas = predio.plantas.map((pl, i) => {
    const det = v.detalleConstrucciones[i]
    const tip = resolveTipologiaCodigo(pl, tipologias)
    return {
      ...pl,
      codigoTipologia: tip?.codigo ?? pl.codigoTipologia,
      valorUnitario: det?.crmc ?? pl.valorUnitario,
    }
  })
  return {
    ...predio,
    plantas,
    valorTerreno: v.vt,
    valorConstruccion: v.vc,
    valorCatastral: v.vi,
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
