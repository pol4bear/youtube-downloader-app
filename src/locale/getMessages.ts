import config from '../common/Config';
const ko:Record<string, string> = require('./ko.json');
const en:Record<string, string> = require('./en.json');

const getMessages:Function = (locale:string|undefined) => {
    if (locale != undefined)
        locale = locale.substr(0, 2);
    
    switch(locale) {
        case 'ko':
            return ko;
        case 'en':
            return en;
        default:
            return getMessages(config.default_locale);
    }
};

export default getMessages;