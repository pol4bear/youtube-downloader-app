const Config = { 
    base_url: process.env.PUBLIC_URL,
    current_locale: navigator.language || navigator.userLanguage, 
    locales: process.env.REACT_APP_LOCALES
};

export default Config;