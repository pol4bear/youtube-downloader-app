import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Main } from '../../Layout';
import SearchForm from './SearchForm';

const Home: React.FC = () => {
  const intl = useIntl();
  const title = intl.formatMessage({ id: 'title' });

  return (
    <Main className="align-center">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <SearchForm />
    </Main>
  );
};

export default Home;
