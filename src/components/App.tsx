import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import styled, { DefaultTheme, ThemeProvider } from 'styled-components';
import { Layout } from 'antd';
import { Home, Search, Watch, Intl } from './Pages';
import { AppHeader, AppFooter, Main, NotFound } from './Layout';
import { getLocaleInfo, LocaleInfo } from '../locales';
import config from '../common/config';
import { getOppositeTheme, getTheme } from '../themes';

const App: React.FC = () => {
  let initialTheme: DefaultTheme;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    initialTheme = getTheme(savedTheme);
  } else {
    initialTheme = getTheme(
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    );
  }
  const [currentTheme, setCurrentTheme] = useState<DefaultTheme>(initialTheme);
  const initialLocale = getLocaleInfo(config.currentLocale);

  const [currentLocale, setCurrentLocale] = useState<LocaleInfo>(initialLocale);

  /**
   * Switch theme light/dark.
   */
  const changeTheme = () => {
    const oppositeTheme = getOppositeTheme(currentTheme);
    setCurrentTheme(oppositeTheme);
    localStorage.setItem('theme', oppositeTheme.name);
  };

  /**
   * Change locale
   *
   * @param input
   */
  const changeLocale = (input: string) => {
    if (currentLocale.locale !== input) setCurrentLocale(getLocaleInfo(input));
  };

  return (
    <Router>
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        <ThemeProvider theme={currentTheme}>
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
              <Route
                component={() => (
                  <Main>
                    <NotFound />
                  </Main>
                )}
              />
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
  p,
  div {
    color: ${(props) => props.theme.fontColor};
  }
`;

export default App;
