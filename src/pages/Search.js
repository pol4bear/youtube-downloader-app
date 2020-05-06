import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {  injectIntl } from 'react-intl';
import Config from '../common/Config';

class Search extends Component {
    constructor(props) {
        super(props);
        this.intl = props.intl;
        this.match = props.match;
    }

    render() {
        return (
            <main role="main" className="align-center container pt-5 pb-5 text-center">
                <Helmet>
                <title>{this.intl.messages.search} - {this.match.params.keyword}</title>
                </Helmet>
            </main>
        );
    }
}

export default withRouter(injectIntl(Search));