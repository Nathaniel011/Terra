import { Component, inject } from '@angular/core'
import { TramiteCatastroMockService } from '../../../data-access/mock/tramite-catastro-mock.service'

@Component({
  selector: 'terra-recepcion-page',
  standalone: true,
  templateUrl: './recepcion.page.html',
  styleUrl: './listado.shared.scss',
})
export class RecepcionPage {
  readonly data = inject(TramiteCatastroMockService)

  crear(id: string) {
    this.data.crearDesdePreregistro(id)
  }
}
