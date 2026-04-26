export interface LanguageOption {
  code: string;
  nativeName: string;
  englishName: string;
}

export const LANGUAGES: readonly LanguageOption[] = [
  { code: 'en', nativeName: 'English', englishName: 'English' },
  { code: 'ru', nativeName: 'Русский', englishName: 'Russian' },
  { code: 'es', nativeName: 'Español', englishName: 'Spanish' },
  { code: 'de', nativeName: 'Deutsch', englishName: 'German' },
  { code: 'fr', nativeName: 'Français', englishName: 'French' },
  { code: 'pt', nativeName: 'Português', englishName: 'Portuguese' },
  { code: 'it', nativeName: 'Italiano', englishName: 'Italian' },
  { code: 'zh', nativeName: '中文', englishName: 'Chinese' },
  { code: 'ja', nativeName: '日本語', englishName: 'Japanese' },
  { code: 'la', nativeName: 'Latina', englishName: 'Latin' },
] as const;

export const LANGUAGE_CODES = LANGUAGES.map((l) => l.code);
