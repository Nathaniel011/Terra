import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PredioMockService } from '../../../data-access/mock/predio-mock.service'

@Component({
  selector: 'terra-salidas-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './salidas.page.html',
  styleUrl: './listado.shared.scss',
})
export class SalidasPage {
  readonly predios = inject(PredioMockService)
  readonly codigo = signal('008-0042-004-00')
  readonly mensaje = signal('')

  generar(tipo: string) {
    this.mensaje.set(
      `${tipo} generado para ${this.codigo()}.`,
    )
  }
}
