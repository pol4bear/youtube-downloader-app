export type Config = {
    base_url: string,
    current_locale: string, 
    default_locale: string|undefined,
    locales: string|undefined
};

const config:Config = {
    base_url: process.env.PUBLIC_URL,
    current_locale: navigator.language,
    default_locale: process.env.REACT_APP_DEFAULT_LOCALE,
    locales: process.env.REACT_APP_LOCALES
} 

export default config;