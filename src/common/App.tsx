import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import styled, { ThemeProvider } from 'styled-components';
import { Layout } from 'antd';
import { Home, Search, Watch, Intl, NotFound } from '../components/Pages';
import { AppHeader, AppFooter } from '../components/Layout';
import { getLocaleInfo, LocaleInfo } from '../locale';
import config from './Config';
import { getTheme, Theme } from '../themes';

const App: React.FC = () => {
  let initialTheme: Theme;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    initialTheme = savedTheme;
  } else {
    initialTheme =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  }
  const [currentTheme, setCurrentTheme] = useState<Theme>(initialTheme);

  const initialLocale = getLocaleInfo(config.currentLocale);
  const [currentLocale, setCurrentLocale] = useState<LocaleInfo>(initialLocale);

  const changeTheme = () => {
    const oppositeTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(oppositeTheme);
    localStorage.setItem('theme', oppositeTheme);
  };

  const changeLocale = (input: string) => {
    if (currentLocale.locale !== input) setCurrentLocale(getLocaleInfo(input));
  };

  return (
    <Router>
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        <ThemeProvider theme={getTheme(currentTheme)}>
          <Wrapper className="layout">
            <AppHeader changeTheme={changeTheme} />
            <Switch>
              <Route exact path={config.baseUrl} component={Home} />
              <Route
                path={`${config.baseUrl}/search/:query`}
                component={Search}
              />
              <Route path={`${config.baseUrl}/search`} component={Search} />
              <Route path={`${config.baseUrl}/watch/:id`} component={Watch} />
              <Route path={`${config.baseUrl}/watch`} component={Watch} />
              <Route
                path={`${config.baseUrl}/intl/:lang`}
                component={() => <Intl changeLocale={changeLocale} />}
              />
              <Route component={NotFound} />
            </Switch>
            <AppFooter />
          </Wrapper>
        </ThemeProvider>
      </IntlProvider>
    </Router>
  );
};

const Wrapper = styled(Layout)`
  background-color: ${(props) => props.theme.contentBackground};
  min-height: 100vh;
  width: 100%;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    color: ${(props) => props.theme.fontColor};
  }
`;

export default App;
