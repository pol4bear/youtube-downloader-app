import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SearchForm } from '../components';
import { injectIntl } from 'react-intl';
import Config from '../common/Config';

class Home extends Component {
    render() {
        const {intl} = this.props;
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
}

export default withRouter(injectIntl(Home));