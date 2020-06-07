export type Config = {
  baseUrl: string;
  currentLocale: string;
  defaultLocale: string;
  locales: string[];
  serverUrl: string;
};

const config: Config = {
  baseUrl: process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '',
  currentLocale: navigator.language,
  defaultLocale: process.env.REACT_APP_DEFAULT_LOCALE
    ? process.env.REACT_APP_DEFAULT_LOCALE
    : 'en',
  locales: process.env.REACT_APP_LOCALES
    ? process.env.REACT_APP_LOCALES.split(',')
    : ['en', 'ko'],
  serverUrl: process.env.REACT_APP_SERVER_URL
    ? process.env.REACT_APP_SERVER_URL
    : '/',
};

export default config;
