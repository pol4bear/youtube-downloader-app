import React from 'react';
import {useDispatch} from 'react-redux';
import {useIntl} from 'react-intl';
import styled from 'styled-components';
import {Navbar, Nav} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faYoutube} from '@fortawesome/free-brands-svg-icons'
import {faAdjust} from '@fortawesome/free-solid-svg-icons';
import Config from '../common/Config';
import {change} from '../stores/theme';
import './Header.scss';

const Header:React.FC = () => {
    const locale_names = require('../locale/locales.json');
    const home = Config.base_url;
    const intl = useIntl();
    const dispatch = useDispatch();

    const changeTheme = () => {
        dispatch(change());
    }

    return (
        <MyNavbar>
            <Navbar.Brand href={home}><FontAwesomeIcon icon={faYoutube} /> {intl.messages.title}</Navbar.Brand>
            <Navbar.Toggle aria-controlls="navigation" />
            <Navbar.Collapse id="navigation">
                <Nav className="ml-auto">
                    <Nav.Link href={home}>{intl.messages.home}</Nav.Link>
                    <Nav.Link onClick={changeTheme}><FontAwesomeIcon icon={faAdjust} rotation={180} fixedWidth /></Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </MyNavbar>
    );
}

const MyNavbar = styled(Navbar)`
    padding-top: 15px;
    padding-bottom: 15px;
    border: 0;
    border-radius: 0;
    margin-bottom: 0;
    font-size: 12px;
    letter-spacing: 5px;
    @extend .bg-light;
    @extend .navbar-light;

    .nav-link:hover {
        color: #1abc9c !important;
    }
`;

export default Header;