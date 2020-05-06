import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import Config from '../common/Config';

class NotFound extends Component {
    render() {
        return (
            <main role="main" className="align-center container pt-5 pb-5 text-center">
                <Helmet>
                    <FormattedMessage id="notfound-title"> { title => <title>${title}</title> }</FormattedMessage>
                </Helmet>
                <h1><FontAwesomeIcon icon={ faStickyNote } /> <FormattedMessage id="notfound-message" /></h1>
            </main>
        );
    }
}

export default withRouter(NotFound);