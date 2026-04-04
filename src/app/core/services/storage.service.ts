import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly prefix = 'gc_';

  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      return raw !== null ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch {
      // localStorage may be full or unavailable
    }
  }
}
