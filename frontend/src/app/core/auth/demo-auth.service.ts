import { Injectable, computed, signal } from '@angular/core'

export interface DemoUser {
  ci: string
  nombre: string
  cargo: string
  rol: string
  reparticion?: string
  email?: string
}

const DEMO_USERS: DemoUser[] = [
  {
    ci: '4521890',
    nombre: 'Pedro Alfonzo Condori Fernandez',
    cargo: 'Resp. de Sistemas',
    rol: 'admin',
    reparticion: 'Depto. de Sistemas',
    email: 'pedro@potosi.gob.bo',
  },
  {
    ci: '3892145',
    nombre: 'Franco Ariel Córdova Nogales',
    cargo: 'Operador Catastro',
    rol: 'operador',
    reparticion: 'Jefatura de Catastro Urbano',
    email: 'franco@potosi.gob.bo',
  },
  {
    ci: '5123678',
    nombre: 'Edgar Sánchez Potosí',
    cargo: 'Inspector',
    rol: 'inspector',
    reparticion: 'Jefatura de Catastro Urbano',
    email: 'edgar@potosi.gob.bo',
  },
  {
    ci: '4987654',
    nombre: 'Peter Pablo Velásquez Ramos',
    cargo: 'Jefe de Catastro',
    rol: 'jefe_catastro',
    reparticion: 'Jefatura de Catastro Urbano',
    email: 'peter@potosi.gob.bo',
  },
]

const SESSION_KEY = 'terra.demo.user'

@Injectable({ providedIn: 'root' })
export class DemoAuthService {
  private readonly user = signal<DemoUser | null>(this.readSession())

  readonly isAuthenticated = computed(() => !!this.user())
  readonly displayName = computed(() => this.user()?.nombre ?? '')
  readonly currentUser = this.user.asReadonly()

  enterWithoutPassword(ci = DEMO_USERS[0].ci): void {
    const found = DEMO_USERS.find((u) => u.ci === ci) ?? DEMO_USERS[0]
    this.persistUser(found)
  }

  logout(): void {
    this.user.set(null)
    sessionStorage.removeItem(SESSION_KEY)
  }

  initials(nombre = this.user()?.nombre ?? ''): string {
    return nombre
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('')
  }

  private persistUser(found: DemoUser): void {
    this.user.set(found)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(found))
  }

  private readSession(): DemoUser | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY)
      return raw ? (JSON.parse(raw) as DemoUser) : null
    } catch {
      return null
    }
  }
}
