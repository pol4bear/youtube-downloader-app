import React, {useContext, useEffect} from 'react';
import history from '../../../utils/history';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Main, CenterAligner } from '../../Layout';
import SearchForm from './SearchForm';
import LoginContext from '../../../contexts/LoginContext';

const Home: React.FC = () => {
  const intl = useIntl();
  const title = intl.formatMessage({ id: 'title' });
  const { isLoggedIn } = useContext(LoginContext);

  useEffect(() => {
      if (!isLoggedIn) {
          const pathname = history.location.pathname;
          const slash = pathname[pathname.length-1] === '/' ? '' : '/';
          history.push(`${history.location.pathname}${slash}login`);
      }
  });

  return (
    <Main>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <CenterAligner>
        <SearchForm />
      </CenterAligner>
    </Main>
  );
};

export default Home;
