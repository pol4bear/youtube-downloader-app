import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Home, Search, Watch, NotFound } from './index';
import config from '../../common/Config';

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

  if (lang === intl.locale) {
    supported = true;
  } else if (config.locales) {
    config.locales.every((locale: string): boolean => {
      if (lang === locale) {
        supported = true;
        return false;
      }
      return true;
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
          <Route component={NotFound} />
        </Switch>
      </>
    );
  }

  return <NotFound />;
};

export default Intl;
