import React from 'react';
import {Layout} from 'antd';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {faCopyright} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const {Footer} = Layout;

const AppFooter:React.FC = () => {
    return (
        <MyFooter>
            <p><FontAwesomeIcon icon={faCopyright} fixedWidth />2020 Pol4bear | <a href="https://github.com/pol4bear/youtube-downloader-app"><FontAwesomeIcon icon={faGithub} />GitHub</a></p>
        </MyFooter>
    );
}

const MyFooter = styled(Footer)`
    background-color: ${props => props.theme.background};
    text-align: center;
    color: ${props => props.theme.font_color};

    a {
        text-decoration: none;
        color: ${props => props.theme.font_color}!important;
    }
`;

export default AppFooter;