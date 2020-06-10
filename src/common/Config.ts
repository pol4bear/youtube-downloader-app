export type Config = {
  baseUrl: string;
  currentLocale: string;
  defaultLocale: string;
  locales: string[];
  serverUrl: string;
  serverSuffix: string;
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
  serverSuffix: process.env.REACT_APP_SERVER_SUFFIX
    ? process.env.REACT_APP_SERVER_SUFFIX
    : '',
};

export default config;
