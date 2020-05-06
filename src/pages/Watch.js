import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import Config from '../common/Config';

class Watch extends Component {
    render() {
        let lang = this.props.match.params.lang == undefined ? Config.current_locale : this.props.match.params.lang;
        return (
            <main role="main" className="align-center container pt-5 pb-5 text-center">
                <Helmet>
                    <title><FormattedMessage id="title" /></title>
                </Helmet>
            </main>
        );
    }
}

export default withRouter(Watch);