import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faAdjust } from '@fortawesome/free-solid-svg-icons';
import { injectIntl, FormattedMessage } from 'react-intl';
import locale_names from '../locale/locales.json';
import Config from '../common/Config';
import './Navbar.scss';

class Navbar extends Component {
    intl = this.props.intl;

    render() {
        const home = process.env.PUBLIC_URL;
        const locale_name = locale_names[this.intl.locale].nativeName.split(', ')[0].split(' (')[0];
        return (
            <nav className="navbar navbar-expand-sm">
                <Link className="navbar-brand" to={ home }><FontAwesomeIcon icon={ faYoutube } /> <FormattedMessage id="title" /></Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navigation">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to={ home }><FormattedMessage id="home" /></Link>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link theme-switch" href="#" role="button" onClick={this.props.changeTheme}><FontAwesomeIcon icon={ faAdjust } rotation={ 180 } fixedWidth /></a>
                    </li>
                </ul>
                </div>
            </nav>
        );
    }
}

export default withRouter(injectIntl(Navbar));