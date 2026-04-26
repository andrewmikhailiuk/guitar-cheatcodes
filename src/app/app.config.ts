import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { provideTransloco } from '@jsverse/transloco';

import { routes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';
import { LANGUAGE_CODES } from './shared/language-switcher/languages';

function detectLanguage(): string {
  try {
    const stored = localStorage.getItem('gc_language');
    if (stored && LANGUAGE_CODES.includes(stored)) return stored;
  } catch {
    // localStorage unavailable
  }
  const browser = navigator.language.substring(0, 2).toLowerCase();
  return LANGUAGE_CODES.includes(browser) ? browser : 'en';
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideTransloco({
      config: {
        availableLangs: [...LANGUAGE_CODES],
        defaultLang: detectLanguage(),
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
