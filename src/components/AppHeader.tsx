import React, {useState} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {useIntl} from 'react-intl';
import styled from 'styled-components';
import {Layout, Menu} from 'antd';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faYoutube} from '@fortawesome/free-brands-svg-icons'
import {faAdjust} from '@fortawesome/free-solid-svg-icons';
import {getLocaleName} from '../locale';
import config from '../common/Config';

const {Header} = Layout;
const {SubMenu} = Menu;

type AppHeaderProp = {
    changeTheme?:VoidFunction
};

const AppHeader:React.FC<any> = (props) => {
    const intl = useIntl();
    const sub_dir = props.location.pathname.split(config.base_url);
    const home = config.base_url + (sub_dir.length >= 2 && sub_dir[1].startsWith('/intl') ? '/intl/' + intl.locale : '');
    const [currentKey, setCurrentKey] = useState<string>('');

    const changeTheme = () => {
        if (props.changeTheme)
            props.changeTheme();
    }
    const handleClick = (event:any) => {
        setCurrentKey(event && event.key);
    }
    const getLocaleLinks = () => {
        let locale_links = [];

        if (config.locales) {
            for (let locale of config.locales.split(',')) {
                if (locale !== intl.locale)
                    locale_links.push(<Menu.Item key={`locale:${locale}`}><Link to={`${config.base_url}/intl/${locale}`}>{getLocaleName(locale).name}</Link></Menu.Item>);
            }
        }

        return locale_links;
    }

    return (
        <MyHeader>
            <Logo><Link to={home}><FontAwesomeIcon icon={faYoutube} /> {intl.messages.title}</Link></Logo>
            <TopMenu mode="horizontal" onClick={handleClick} selectable={false}>
                <Menu.Item key="home"><Link to={home}>{intl.messages.home}</Link></Menu.Item>
                <SubMenu title={getLocaleName(intl.locale).name}>
                    {getLocaleLinks()}
                </SubMenu>
                <Menu.Item key="theme"><Link to="#" onClick={changeTheme}><FontAwesomeIcon icon={faAdjust} rotation={180} fixedWidth /></Link></Menu.Item>
            </TopMenu>
        </MyHeader>
    );
}

const MyHeader = styled(Header)`
    background-color: ${props => props.theme.background};
`;

const Logo = styled.div`
    height: 100%;
    text-align: center;
    float: left;
    margin-left: 10px;

    & > a {
        font-size: 1em;
        letter-spacing: 5px;
        color: ${props => props.theme.font_color}
    }

    &:hover > a {
        color: #1abc9c!important;
    }
`;

const TopMenu = styled(Menu)`
    height: 100%;
    background-color: transparent!important;
    float: right;
    vertical-align: middle;
    border-bottom: 1px solid ${props => props.theme.background}!important;

    & > li > * {
        display: block!important;
        color: ${props => props.theme.font_color}!important;
    }

    & > li:hover {
        border-bottom: 2px solid #1abc9c!important;

        & > a {
            color: #1abc9c !important;            
        }
    }
`;

export default withRouter(AppHeader);