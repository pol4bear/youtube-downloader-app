import React from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faYoutube} from '@fortawesome/free-brands-svg-icons'
import {faAdjust} from '@fortawesome/free-solid-svg-icons';
import {useIntl, FormattedMessage} from 'react-intl';
import Config from '../common/Config';
import {change} from '../stores/theme';
import './Navbar.scss';

const Navbar:React.FC = () => {
    const locale_names = require('../locale/locales.json');
    const home = Config.base_url;
    const intl = useIntl();
    const dispatch = useDispatch();

    const changeTheme = () => {
        dispatch(change());
    }

    return (
        <nav className="navbar navbar-expand-sm">
            <Link className="navbar-brand" to={home}><FontAwesomeIcon icon={faYoutube} /> <FormattedMessage id="title" /></Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navigation">
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <Link className="nav-link" to={home}><FormattedMessage id="home" /></Link>
                </li>
                <li className="nav-item">
                <a className="nav-link theme-switch" href="#" onClick={changeTheme} role="button"><FontAwesomeIcon icon={faAdjust} rotation={180} fixedWidth /></a>
                </li>
            </ul>
            </div>
        </nav>
    );
}

export default Navbar;