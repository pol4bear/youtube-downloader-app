import React from 'react';
import {Helmet} from 'react-helmet';
import {SearchForm} from '../components';
import {useIntl} from 'react-intl';
import Config from '../common/Config';

const Home:React.FC = () => {
    const intl = useIntl();
    const title = intl.formatMessage({id: 'title'});

    return (
        <main role="main" className="align-center container pt-5 pb-5 text-center">
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <SearchForm />
        </main>
    );
}

export default Home;