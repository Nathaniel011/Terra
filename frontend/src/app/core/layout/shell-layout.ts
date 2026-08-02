import { Location } from '@angular/common'
import { Component, computed, HostListener, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { filter, map, startWith } from 'rxjs'
import { Button } from 'primeng/button'
import { DemoAuthService } from '../auth/demo-auth.service'
import { TERRA_NAV_GROUPS } from './nav.config'

const CRUMB_LABELS: Record<string, string> = {
  inicio: 'Inicio',
  unidades: 'Unidades catastrales',
  mapa: 'Consulta geográfica',
  tramites: 'Trámites',
  recepcion: 'Recepción',
  inspecciones: 'Inspecciones',
  valoracion: 'Valoración',
  catalogos: 'Catálogos',
  salidas: 'Salidas y consultas',
}

@Component({
  selector: 'terra-shell-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Button],
  templateUrl: './shell-layout.html',
  styleUrl: './shell-layout.scss',
})
export class ShellLayoutComponent {
  readonly auth = inject(DemoAuthService)
  private readonly router = inject(Router)
  private readonly location = inject(Location)
  readonly navGroups = TERRA_NAV_GROUPS
  readonly menuOpen = signal(false)

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  )

  readonly crumb = computed(() => {
    const parts = (this.url() ?? '').split('/').filter(Boolean)
    if (parts[0] !== 'app') return 'Panel'
    if (parts.length >= 3 && parts[1] === 'unidades') return parts[2]
    return CRUMB_LABELS[parts[1] ?? 'inicio'] ?? 'Catastro'
  })

  readonly crumbPrefix = computed(() => {
    const parts = (this.url() ?? '').split('/').filter(Boolean)
    if (parts.length >= 3 && parts[1] === 'unidades') return 'TERRA / Unidades'
    return 'TERRA'
  })

  readonly pageAnim = signal(true)

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.menuOpen.set(false)
        this.pageAnim.set(false)
        requestAnimationFrame(() => this.pageAnim.set(true))
      })
  }

  toggleMenu() {
    this.menuOpen.update((open) => !open)
  }

  closeMenu() {
    this.menuOpen.set(false)
  }

  goBack() {
    this.closeMenu()
    if (typeof window !== 'undefined' && window.history.length > 1) {
      this.location.back()
      return
    }
    void this.router.navigateByUrl('/app/inicio')
  }

  logout() {
    this.auth.logout()
    void this.router.navigateByUrl('/login')
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.menuOpen()) this.closeMenu()
  }

  @HostListener('window:resize')
  onResize() {
    if (typeof window !== 'undefined' && window.innerWidth > 960 && this.menuOpen())
      this.closeMenu()
  }
}
