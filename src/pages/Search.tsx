import React from 'react';
import {RouteComponentProps, RouteProps} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {useIntl} from 'react-intl';
import Config from '../common/Config';

type RouteInfo = {
    keyword: string
};

const Search:React.FC<RouteComponentProps<RouteInfo>> = ({match}) => {
    const intl = useIntl();

    return (
        <main role="main" className="align-center container pt-5 pb-5 text-center">
            <Helmet>
            <title>{intl.messages.search} - {match.params.keyword}</title>
            </Helmet>
        </main>
    );
}

export default Search;