import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-tab-nav',
  imports: [RouterLink, RouterLinkActive, TranslocoModule],
  template: `
    <nav class="flex gap-1 border-b border-fret-line px-4 overflow-x-auto">
      @for (tab of tabs; track tab.path) {
        <a
          [routerLink]="tab.path"
          routerLinkActive="text-note-root border-b-2 border-note-root"
          class="px-4 py-3 text-sm transition-colors hover:text-white whitespace-nowrap"
        >
          {{ tab.labelKey | transloco }}
        </a>
      }
    </nav>
  `,
})
export class TabNavComponent {
  readonly tabs = [
    { path: '/gammas', labelKey: 'tabs.gammas' },
    { path: '/tunings', labelKey: 'tabs.tunings' },
    { path: '/eq', labelKey: 'tabs.eq' },
    { path: '/metronome', labelKey: 'tabs.metronome' },
  ];
}
