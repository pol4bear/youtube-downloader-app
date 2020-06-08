import React from 'react';
import { Helmet } from 'react-helmet';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useIntl, FormattedMessage } from 'react-intl';
import { Main } from '../Layout';

const NotFound: React.FC = () => {
  const intl = useIntl();

  return (
    <Main className="align-center">
      <Helmet>
        <title>{intl.messages.notfoundTitle}</title>
      </Helmet>
      <h1>
        <FontAwesomeIcon icon={faStickyNote} />{' '}
        <FormattedMessage id="notfoundMessage" />
      </h1>
    </Main>
  );
};

export default NotFound;
