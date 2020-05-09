const Config:any = {
    base_url: process.env.PUBLIC_URL,
    current_locale: navigator.language, 
    locales: process.env.REACT_APP_LOCALES
};

export default Config;