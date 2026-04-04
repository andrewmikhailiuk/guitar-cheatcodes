import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-tab-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="flex gap-1 border-b border-fret-line px-4">
      @for (tab of tabs; track tab.path) {
        <a
          [routerLink]="tab.path"
          routerLinkActive="text-note-root border-b-2 border-note-root"
          class="px-4 py-3 text-sm transition-colors hover:text-white"
        >
          {{ tab.label }}
        </a>
      }
    </nav>
  `,
})
export class TabNavComponent {
  readonly tabs = [
    { path: '/scales', label: 'Scales' },
    { path: '/tunings', label: 'Tunings' },
    { path: '/eq', label: 'EQ' },
  ];
}
