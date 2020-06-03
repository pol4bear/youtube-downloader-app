import config from '../common/Config';

export type Messages = Record<string, string>;
export type Locales = {
    [key:string]:{
        name:string,
        nativeName:string
    }
};
export type LocaleInfo = {
    locale:string,
    messages:Messages
};
export type LocaleName = {
    code:string,
    name:string|null
};

export const getLocaleInfo:Function = (locale:string|undefined):LocaleInfo => {
    if (locale !== undefined)
        locale = locale.substr(0, 2);
    
    switch(locale) {
        case 'ko':
            return {locale: locale, messages: ko};
        case 'en':
            return {locale: locale, messages: en};
        default:
            return getLocaleInfo(config.default_locale);
    }
};

const locale_names:Locales = require('./locales.json');
export const getLocaleName = (locale:string):LocaleName => {
    if (locale !== undefined)
        locale = locale.substr(0, 2);
    
    const locale_info = locale_names[locale];

    return { code: locale, name: locale_info ? locale_info.nativeName.split(',')[0].split(' (')[0] : null };
}

export const ko:Messages = require('./ko.json');
export const en:Messages = require('./en.json');