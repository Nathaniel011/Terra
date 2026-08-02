import { Routes } from '@angular/router'
import { demoAuthGuard } from './core/auth/demo-auth.guard'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'app',
    canActivate: [demoAuthGuard],
    loadComponent: () =>
      import('./core/layout/shell-layout').then((m) => m.ShellLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/terra/pages/inicio.page').then((m) => m.InicioPage),
      },
      {
        path: 'unidades',
        loadComponent: () =>
          import('./features/terra/pages/unidades.page').then((m) => m.UnidadesPage),
      },
      {
        path: 'unidades/:codigo',
        loadComponent: () =>
          import('./features/terra/pages/ficha-unidad.page').then((m) => m.FichaUnidadPage),
      },
      {
        path: 'mapa',
        loadComponent: () =>
          import('./features/terra/pages/mapa.page').then((m) => m.MapaPage),
      },
      {
        path: 'tramites',
        loadComponent: () =>
          import('./features/terra/pages/tramites.page').then((m) => m.TramitesPage),
      },
      {
        path: 'recepcion',
        loadComponent: () =>
          import('./features/terra/pages/recepcion.page').then((m) => m.RecepcionPage),
      },
      {
        path: 'inspecciones',
        loadComponent: () =>
          import('./features/terra/pages/inspecciones.page').then((m) => m.InspeccionesPage),
      },
      {
        path: 'valoracion',
        loadComponent: () =>
          import('./features/terra/pages/valoracion.page').then((m) => m.ValoracionPage),
      },
      {
        path: 'catalogos',
        loadComponent: () =>
          import('./features/terra/pages/catalogos.page').then((m) => m.CatalogosPage),
      },
      {
        path: 'salidas',
        loadComponent: () =>
          import('./features/terra/pages/salidas.page').then((m) => m.SalidasPage),
      },
      // redirects legado
      { path: 'predios', redirectTo: 'unidades' },
      { path: 'predios/:codigo', redirectTo: 'unidades/:codigo' },
      { path: 'cartografia', redirectTo: 'mapa' },
      { path: 'reportes', redirectTo: 'salidas' },
      { path: 'propietarios', redirectTo: 'unidades' },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
]
