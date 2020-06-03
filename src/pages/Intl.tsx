import React from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';
import {useIntl} from 'react-intl';
import {Home, Search, Watch, NotFound} from '../pages';
import config from '../common/Config';

const Intl:React.FC<any> = (props) => {
    const supported_locale = config.locales && config.locales.split(',');
    const intl = useIntl();
    const lang = props.match.params.lang;
    let supported:boolean = false;

    if (lang === intl.locale) {
        supported = true;
    }
    else if (supported_locale){
        for (let locale of supported_locale) {
            if (lang === locale) {
                supported = true;
                break;
            }
        }
    }

    if (supported) {
        if (lang !== intl.locale && props.changeLocale)
            props.changeLocale(lang);

        return (
            <>
                <Switch>
                    <Route exact path={`${props.match.url}`} component={Home} />
                    <Route path={`${props.match.url}/search/:keyword`} component={Search} />
                    <Route path={`${props.match.url}/watch`} component={Watch} />
                    <Route path={`${props.match.url}/watch/:id`} component={Watch} />
                    <Route component={NotFound} />
                </Switch>
            </>
        );
    }
    else {
        return (
            <NotFound />
        );
    }
};

export default withRouter(Intl);