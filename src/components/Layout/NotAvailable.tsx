import React from 'react';
import { Helmet } from 'react-helmet';
import { faSadTear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useIntl, FormattedMessage } from 'react-intl';
import CenterAligner from './CenterAligner';

const NotAvailable: React.FC = () => {
  const intl = useIntl();

  return (
    <CenterAligner>
      <Helmet>
        <title>{intl.messages.serviceNotAvailable}</title>
      </Helmet>
      <h1>
        <FontAwesomeIcon icon={faSadTear} />{' '}
        <FormattedMessage id="serviceNotAvailable" />
      </h1>
    </CenterAligner>
  );
};

export default NotAvailable;
