import React from 'react';
import {Helmet} from 'react-helmet';
import {FormattedMessage} from 'react-intl';
import Config from '../common/Config';

const Watch:React.FC = () => {
    return (
        <main role="main" className="align-center container pt-5 pb-5 text-center">
            <Helmet>
                <title><FormattedMessage id="title" /></title>
            </Helmet>
        </main>
    );
}

export default Watch;