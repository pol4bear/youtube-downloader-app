import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Switch, useRouteMatch} from 'react-router-dom';
import {IntlProvider} from 'react-intl';
import styled, {ThemeProvider} from 'styled-components';
import {Layout} from 'antd';
import {Home, Search, Watch, Intl, NotFound} from '../pages';
import {AppHeader, AppFooter} from '../components';
import {getLocaleInfo, LocaleInfo} from '../locale';
import config from './Config';
import {getTheme} from '../themes';
import {Theme} from '../themes';

const App:React.FC = () => {
    let initial_theme:Theme;
    let saved_theme = localStorage.getItem('theme');
    if (saved_theme && (saved_theme === 'light' || saved_theme === 'dark')) {
        initial_theme = saved_theme as Theme;
    }
    else {
        initial_theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    const [currentTheme, setCurrentTheme] = useState<Theme>(initial_theme);

    let suppo
    const initial_locale = getLocaleInfo(config.current_locale);
    const [currentLocale, setCurrentLocale] = useState<LocaleInfo>(initial_locale);

    const changeTheme = () => {
        const opposite_theme = currentTheme === 'light' ? 'dark' : 'light';
        setCurrentTheme(opposite_theme);
        localStorage.setItem('theme', opposite_theme);
    }

    const changeLocale = (input:string) => {
        if (currentLocale.locale !== input)
            setCurrentLocale(getLocaleInfo(input));
    }

    return (
        <Router>
            <IntlProvider locale={currentLocale.locale} messages={currentLocale.messages}>
                <ThemeProvider theme={getTheme(currentTheme)}>
                    <Wrapper className="layout">
                        <AppHeader changeTheme={changeTheme} />
                        <Switch>
                            <Route exact path={config.base_url} component={Home} />
                            <Route path={`${config.base_url}/search/:keyword`} component={Search} />
                            <Route path={`${config.base_url}/watch`} component={Watch} />
                            <Route path={`${config.base_url}/watch/:id`} component={Watch} />
                            <Route path={`${config.base_url}/intl/:lang`} component={() => <Intl changeLocale={changeLocale} />} />
                            <Route component={NotFound} />
                        </Switch>
                        <AppFooter />
                    </Wrapper>
                </ThemeProvider>
            </IntlProvider>
        </Router>
    );
}

const Wrapper = styled(Layout)`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: ${props => props.theme.content_background};

    h1, h2, h3, h4, h5, h6, p {
        color: ${props => props.theme.font_color};
    }
`;

export default App;