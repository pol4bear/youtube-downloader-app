import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Main } from '../../Layout';
import SearchForm from './SearchForm';
import CenterAligner from '../../Layout/CenterAligner';

const Home: React.FC = () => {
  const intl = useIntl();
  const title = intl.formatMessage({ id: 'title' });

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
