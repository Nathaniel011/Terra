import { Injectable, computed, signal } from '@angular/core'
import Keycloak from 'keycloak-js'
import { environment } from '../../../environments/environment'

const REDIRECT_PATH = '/app/inicio'

/**
 * Cliente Keycloak para cuando `environment.keycloak.enabled` sea true.
 * Mientras esté deshabilitado, el login usa DemoAuthService.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = signal<Keycloak | null>(null)
  private readonly ready = signal(false)

  readonly isAuthenticated = computed(() => !!this.keycloak()?.authenticated)

  async init(): Promise<boolean> {
    if (!environment.keycloak.enabled) return false
    if (this.keycloak() && this.ready()) return !!this.keycloak()?.authenticated

    const kc = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId,
    })
    const authenticated = await kc.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    })
    this.keycloak.set(kc)
    this.ready.set(true)
    return authenticated
  }

  async login(redirectPath = REDIRECT_PATH): Promise<void> {
    if (!environment.keycloak.enabled) return
    await this.init()
    let kc = this.keycloak()
    if (!kc) {
      await this.init()
      kc = this.keycloak()
    }
    if (!kc) return
    const redirectUri = `${window.location.origin}${redirectPath}`
    await kc.login({ redirectUri })
  }

  async logout(): Promise<void> {
    await this.keycloak()?.logout({ redirectUri: `${window.location.origin}/login` })
  }

  token(): string | undefined {
    return this.keycloak()?.token
  }
}
