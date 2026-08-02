import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideHttpClient } from '@angular/common/http'
import { provideRouter, withComponentInputBinding } from '@angular/router'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import { routes } from './app.routes'
import { terraPreset } from './core/theme/terra-preset'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: terraPreset,
        options: {
          darkModeSelector: false,
        },
      },
    }),
  ],
}
