import React from 'react';
import { Helmet } from 'react-helmet';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useIntl, FormattedMessage } from 'react-intl';
import { Main } from '../components';

const NotFound: React.FC = () => {
  const intl = useIntl();

  return (
    <Main className="align-center">
      <Helmet>
        <title>{intl.messages.title}</title>
      </Helmet>
      <h1>
        <FontAwesomeIcon icon={faStickyNote} />{' '}
        <FormattedMessage id="notfound-message" />
      </h1>
    </Main>
  );
};

export default NotFound;
