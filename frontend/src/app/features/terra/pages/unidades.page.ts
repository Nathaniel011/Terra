import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PredioMockService } from '../../../data-access/mock/predio-mock.service'

@Component({
  selector: 'terra-unidades-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './unidades.page.html',
  styleUrl: './listado.shared.scss',
})
export class UnidadesPage {
  readonly data = inject(PredioMockService)
  search = ''

  onSearch(value: string) {
    this.search = value
    this.data.setQuery(value)
  }
}
