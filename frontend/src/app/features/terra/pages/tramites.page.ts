import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { TramiteCatastroMockService } from '../../../data-access/mock/tramite-catastro-mock.service'

@Component({
  selector: 'terra-tramites-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tramites.page.html',
  styleUrl: './listado.shared.scss',
})
export class TramitesPage {
  readonly data = inject(TramiteCatastroMockService)
}
