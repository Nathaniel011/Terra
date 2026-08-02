import { Injectable, computed, signal } from '@angular/core'
import { PreRegistro, TramiteCatastral } from './catastro.model'
import { SEED_PREREGISTROS, SEED_TRAMITES } from './catastro.seed'

/** Trámites catastrales y pre-registros de recepción */
@Injectable({ providedIn: 'root' })
export class TramiteCatastroMockService {
  private readonly tramites = signal<TramiteCatastral[]>(structuredClone(SEED_TRAMITES))
  private readonly preregistros = signal<PreRegistro[]>(structuredClone(SEED_PREREGISTROS))

  readonly all = this.tramites.asReadonly()
  readonly preregistrosAll = this.preregistros.asReadonly()

  readonly pendientes = computed(() =>
    this.tramites().filter((t) => t.estado === 'PENDIENTE' || t.estado === 'EN_PROCESO'),
  )

  readonly observados = computed(() => this.tramites().filter((t) => t.estado === 'OBSERVADO'))

  crearDesdePreregistro(id: string): void {
    const pre = this.preregistros().find((p) => p.id === id)
    if (!pre || pre.sincronizado) return
    const numero = `CAT-2026-${String(200 + this.tramites().length).padStart(4, '0')}`
    this.tramites.update((list) => [
      {
        id: `tr-${Date.now()}`,
        numero,
        tipo: pre.tipoTramite,
        codigoCatastral: pre.codigoCatastral ?? 'SIN-ASIGNAR',
        solicitante: pre.solicitante,
        estado: 'PENDIENTE',
        fechaInicio: new Date().toISOString().slice(0, 10),
        tareaActual: 'Recepción / ingreso',
        funcionario: 'Recepcionista',
      },
      ...list,
    ])
    this.preregistros.update((list) =>
      list.map((p) => (p.id === id ? { ...p, sincronizado: true } : p)),
    )
  }
}
