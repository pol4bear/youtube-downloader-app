import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {useIntl} from 'react-intl';
import {Main} from '../components';

type RouteInfo = {
    lang: string,
    keyword: string
};

const Search:React.FC<RouteComponentProps<RouteInfo>> = ({match}) => {
    const intl = useIntl();

    return (
        <Main>
            <Helmet>
                <title>{intl.messages.search} - {match.params.keyword}</title>
            </Helmet>
        </Main>
    );
}

export default Search;