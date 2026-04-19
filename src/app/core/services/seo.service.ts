import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { combineLatest, filter, startWith } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly transloco = inject(TranslocoService);

  init(): void {
    combineLatest([
      this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        startWith(null),
      ),
      this.transloco.langChanges$,
    ]).subscribe(() => this.update());
  }

  private update(): void {
    const path = this.router.url.split('?')[0].replace(/^\//, '') || 'gammas';
    const titleKey = `seo.${path}.title`;
    const descKey = `seo.${path}.description`;

    const pageTitle = this.transloco.translate(titleKey);
    const description = this.transloco.translate(descKey);

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
  }
}
