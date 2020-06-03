import React from 'react';
import {Helmet} from 'react-helmet';
import {FormattedMessage} from 'react-intl';
import {Main} from '../components';

const Watch:React.FC = () => {
    return (
        <Main>
            <Helmet>
                <title><FormattedMessage id="title" /></title>
            </Helmet>
        </Main>
    );
}

export default Watch;