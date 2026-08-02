import { Injectable, signal } from '@angular/core'
import {
  FactorDepreciacion,
  FactorPendienteCatalogo,
  TipologiaVivienda,
  ZonaSuelo,
} from './catastro.model'
import {
  SEED_FACTORES_DEPRECIACION,
  SEED_FACTORES_PENDIENTE,
  SEED_TIPOLOGIAS,
  SEED_ZONAS_SUELOS,
} from './catastro.seed'

/** Catálogos de zonas, suelos, factores y tipologías */
@Injectable({ providedIn: 'root' })
export class CatalogoMockService {
  readonly zonasSuelos = signal<ZonaSuelo[]>(structuredClone(SEED_ZONAS_SUELOS))
  readonly factoresDepreciacion = signal<FactorDepreciacion[]>(
    structuredClone(SEED_FACTORES_DEPRECIACION),
  )
  readonly factoresPendiente = signal<FactorPendienteCatalogo[]>(
    structuredClone(SEED_FACTORES_PENDIENTE),
  )
  readonly tipologias = signal<TipologiaVivienda[]>(structuredClone(SEED_TIPOLOGIAS))
}
