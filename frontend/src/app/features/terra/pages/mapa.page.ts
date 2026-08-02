import { Component, computed, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { PredioMockService } from '../../../data-access/mock/predio-mock.service'

@Component({
  selector: 'terra-mapa-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mapa.page.html',
  styleUrl: './mapa.page.scss',
})
export class MapaPage {
  readonly predios = inject(PredioMockService)
  readonly selected = signal('008-0042-004-00')

  readonly selectedPredio = computed(() => this.predios.byCodigo(this.selected()))

  selectLot(codigo: string, event: Event) {
    event.preventDefault()
    this.selected.set(codigo)
  }
}
