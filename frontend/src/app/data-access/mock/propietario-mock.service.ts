import { Injectable, computed, inject, signal } from '@angular/core'
import { Propietario } from './catastro.model'
import { SEED_PROPIETARIOS } from './catastro.seed'
import { PredioMockService } from './predio-mock.service'

@Injectable({ providedIn: 'root' })
export class PropietarioMockService {
  private readonly predios = inject(PredioMockService)
  private readonly query = signal('')

  /** nroPredios derivado de unidades catastrales (no del seed estático). */
  readonly all = computed<Propietario[]>(() => {
    const counts = new Map<string, number>()
    for (const p of this.predios.all()) {
      const key = p.codigoPropietario
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return SEED_PROPIETARIOS.map((owner) => ({
      ...owner,
      nroPredios: counts.get(owner.codigo) ?? 0,
    }))
  })

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase()
    const list = this.all()
    if (!q) return list
    return list.filter(
      (p) =>
        p.codigo.includes(q) ||
        p.nombre.toLowerCase().includes(q) ||
        p.documento.includes(q),
    )
  })

  setQuery(value: string) {
    this.query.set(value)
  }
}
