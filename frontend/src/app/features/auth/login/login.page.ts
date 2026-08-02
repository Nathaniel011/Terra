import { Component, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { environment } from '../../../../environments/environment'
import { DemoAuthService } from '../../../core/auth/demo-auth.service'

@Component({
  selector: 'terra-login-page',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly auth = inject(DemoAuthService)
  private readonly router = inject(Router)

  submitting = signal(false)
  error = signal('')

  private readonly keycloakEnabled = environment.keycloak.enabled

  async ingresar() {
    this.submitting.set(true)
    this.error.set('')

    try {
      if (!this.keycloakEnabled) {
        this.auth.enterWithoutPassword()
        await this.router.navigateByUrl('/app/inicio')
        return
      }

      // Keycloak real: pendiente de cablear AuthService + guard (fase posterior).
      const { url, realm, clientId } = environment.keycloak
      const redirectUri = encodeURIComponent(`${window.location.origin}/app/inicio`)
      const authUrl =
        `${url}/realms/${realm}/protocol/openid-connect/auth` +
        `?client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${redirectUri}` +
        `&response_type=code` +
        `&scope=openid`

      window.location.assign(authUrl)
    } catch {
      this.error.set('No se pudo iniciar sesión. Intente nuevamente.')
    } finally {
      this.submitting.set(false)
    }
  }
}
