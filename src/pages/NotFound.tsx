import React from 'react';
import {Helmet} from 'react-helmet';
import {faStickyNote} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useIntl, FormattedMessage} from 'react-intl';
import Config from '../common/Config';

const NotFound:React.FC = () => {
    const intl = useIntl();

    return (
        <main role="main" className="align-center container pt-5 pb-5 text-center">
            <Helmet>
                <title>{intl.messages.title}</title>
            </Helmet>
            <h1><FontAwesomeIcon icon={faStickyNote} /> <FormattedMessage id="notfound-message" /></h1>
        </main>
    );
}

export default NotFound;