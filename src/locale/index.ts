import config from '../common/Config';
import locales from './locales.json';
import koLang from './ko.json';
import enLang from './en.json';

const localeNames: Locales = locales;
export const ko: Messages = koLang;
export const en: Messages = enLang;

export type Messages = Record<string, string>;
export type Locales = {
  [key: string]: {
    name: string;
    nativeName: string;
  };
};
export type LocaleInfo = {
  locale: string;
  messages: Messages;
};
export type LocaleName = {
  code: string;
  name: string | null;
};
export const getLocaleInfo = (locale: string | undefined): LocaleInfo => {
  let localeCode = locale;
  if (localeCode !== undefined) localeCode = localeCode.substr(0, 2);

  switch (locale) {
    case 'ko':
      return { locale, messages: ko };
    case 'en':
      return { locale, messages: en };
    default:
      return getLocaleInfo(config.defaultLocale);
  }
};

export const getLocaleName = (locale: string): LocaleName => {
  let localeCode = locale;
  if (localeCode !== undefined) localeCode = localeCode.substr(0, 2);

  const localeInfo = localeNames[locale];

  return {
    code: locale,
    name: localeInfo
      ? localeInfo.nativeName.split(',')[0].split(' (')[0]
      : null,
  };
};
