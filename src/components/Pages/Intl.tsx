import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { useIntl } from 'react-intl';
import config from '../../common/config';
import {Account, FindPassword, Home, Login, Register, Search, Watch, Message} from './index';
import { Main, NotFound } from '../Layout';

interface IntlProp {
  changeLocale?: (input: string) => void;
}

interface MatchParams {
  lang: string;
}

const Intl: React.FC<IntlProp> = (props) => {
  const intl = useIntl();
  const match = useRouteMatch<MatchParams>();
  const { lang } = match.params;
  let supported = false;

  // Check if locale is supported.
  if (lang === intl.locale) {
    supported = true;
  } else if (config.locales) {
    supported = config.locales.some((locale: string): boolean => {
      if (lang === locale) {
        return true;
      }
      return false;
    });
  }

  if (supported) {
    if (lang !== intl.locale && props.changeLocale) props.changeLocale(lang);

    return (
      <>
        <Switch>
          <Route exact path={`${match.url}`} component={Home} />
          <Route path={`${match.url}/search/:query`} component={Search} />
          <Route path={`${match.url}/search`} component={Search} />
          <Route path={`${match.url}/watch/:id`} component={Watch} />
          <Route path={`${match.url}/watch`} component={Watch} />
          <Route exact path={`${match.url}/login`} component={Login} />
          <Route exact path={`${match.url}/register`} component={Register} />
          <Route exact path={`${match.url}/find-password`} component={FindPassword} />
          <Route exact path={`${match.url}/account`} component={Account} />
          <Route exact path={`${match.url}/message/:page`} component={Message} />
          <Route exact path={`${match.url}/message`} component={Message} />
          <Route
            component={() => (
              <Main>
                <NotFound />
              </Main>
            )}
          />
        </Switch>
      </>
    );
  }

  return <NotFound />;
};

export default Intl;
