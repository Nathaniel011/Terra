import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { DemoAuthService } from './demo-auth.service'

export const demoAuthGuard: CanActivateFn = () => {
  const auth = inject(DemoAuthService)
  const router = inject(Router)
  if (auth.isAuthenticated()) return true
  return router.createUrlTree(['/login'])
}
