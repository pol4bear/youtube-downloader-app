import React from 'react';
import {Helmet} from 'react-helmet';
import {Main, SearchForm} from '../components';
import {useIntl} from 'react-intl';
import {Layout} from 'antd';
import Config from '../common/Config';

const Home:React.FC = () => {
    const intl = useIntl();
    const title = intl.formatMessage({id: 'title'});

    return (
        <Main className="ant-layout-content align-center">
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <SearchForm />
        </Main>
    );
}

export default Home;