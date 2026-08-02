import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { PredioMockService } from '../../../data-access/mock/predio-mock.service'
import { TramiteCatastroMockService } from '../../../data-access/mock/tramite-catastro-mock.service'
import { InspeccionMockService } from '../../../data-access/mock/inspeccion-mock.service'

@Component({
  selector: 'terra-inicio-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.scss',
})
export class InicioPage {
  readonly predios = inject(PredioMockService)
  readonly tramites = inject(TramiteCatastroMockService)
  readonly inspecciones = inject(InspeccionMockService)

  readonly modulos = [
    {
      path: '/app/unidades',
      icon: 'pi-building',
      title: 'Unidades catastrales',
      desc: 'Consulta y ficha de predios',
    },
    {
      path: '/app/mapa',
      icon: 'pi-globe',
      title: 'Consulta geográfica',
      desc: 'Ubicación de unidades en el radio urbano',
    },
    {
      path: '/app/tramites',
      icon: 'pi-sitemap',
      title: 'Trámites',
      desc: 'Bandeja de trámites y tareas en curso',
    },
    {
      path: '/app/recepcion',
      icon: 'pi-inbox',
      title: 'Recepción',
      desc: 'Pre-registro y alta de solicitudes',
    },
    {
      path: '/app/inspecciones',
      icon: 'pi-clipboard',
      title: 'Inspecciones',
      desc: 'Programación y seguimiento de campo',
    },
    {
      path: '/app/valoracion',
      icon: 'pi-calculator',
      title: 'Valoración',
      desc: 'Avalúo individual y masivo por gestión',
    },
    {
      path: '/app/catalogos',
      icon: 'pi-table',
      title: 'Catálogos',
      desc: 'Zonas, suelos, tipologías y factores',
    },
    {
      path: '/app/salidas',
      icon: 'pi-file',
      title: 'Salidas',
      desc: 'Certificados, fichas y reportes',
    },
  ]
}
