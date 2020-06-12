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

/**
 * Get locale info by locale code
 * Return locale info of locale code locale info of default locale otherwise.
 *
 * @param locale
 * @return LocaleInfo object
 */
export const getLocaleInfo = (locale: string | undefined): LocaleInfo => {
  let localeCode = locale;
  if (localeCode !== undefined) localeCode = localeCode.substr(0, 2);

  switch (localeCode) {
    case 'ko':
      return { locale: localeCode, messages: ko };
    case 'en':
      return { locale: localeCode, messages: en };
    default:
      return getLocaleInfo(config.defaultLocale);
  }
};

/**
 * Get locale name by locale code
 * Return locale name of locale code locale name with null otherwise.
 *
 * @param locale
 * @return LocaleName object
 */
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
