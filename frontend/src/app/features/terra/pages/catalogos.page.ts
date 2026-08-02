import { Component, inject, signal } from '@angular/core'
import { CatalogoMockService } from '../../../data-access/mock/catalogo-mock.service'

type CatalogoTab = 'zonas' | 'depreciacion' | 'pendiente' | 'tipologias'

@Component({
  selector: 'terra-catalogos-page',
  standalone: true,
  templateUrl: './catalogos.page.html',
  styleUrl: './listado.shared.scss',
})
export class CatalogosPage {
  readonly data = inject(CatalogoMockService)
  readonly tab = signal<CatalogoTab>('zonas')
}
