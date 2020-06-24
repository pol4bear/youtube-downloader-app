import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Button, Drawer, Layout, Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faAdjust, faBars } from '@fortawesome/free-solid-svg-icons';
import { getLocaleName } from '../../locales';
import config from '../../common/config';
import LoginContext from "../../contexts/LoginContext";

const { Header } = Layout;
const { SubMenu } = Menu;

type AppHeaderProp = {
  changeTheme?: VoidFunction;
};

const AppHeader: React.FC<AppHeaderProp> = (props) => {
  const intl = useIntl();
  const location = useLocation();

  const subDir: string[] = location.pathname.split(config.baseUrl);
  /**
   * Path of index page.
   */
  const home =
    config.baseUrl +
    (subDir.length >= 2 && subDir[1].startsWith('/intl')
      ? `/intl/${intl.locale}`
      : '');

  /**
   * Mobile menu visible state and setter.
   */
  const [visible, setVisible] = useState<boolean>(false);

  /**
   * Execute props.changeTheme if it exists.
   */
  const changeTheme = () => {
    if (props.changeTheme) props.changeTheme();
  };

  /**
   * Get change locale links.
   */
  const getLocaleLinks = () => {
    const localeLinks: JSX.Element[] = [];

    // Loop config.locales and add to localeLinks if is not current locale.
    config.locales.forEach((locale: string) => {
      if (locale !== intl.locale)
        localeLinks.push(
          <Menu.Item key={`locale:${locale}`}>
            <Link to={`${config.baseUrl}/intl/${locale}`}>
              {getLocaleName(locale).name}
            </Link>
          </Menu.Item>
        );
    });

    return localeLinks;
  };

  /**
   * Show mobile menu.
   */
  const showDrawer = () => {
    setVisible(true);
  };

  /**
   * Close mobile menu.
   */
  const onClose = () => {
    setVisible(false);
  };

  const localeLinks = getLocaleLinks();

  return (
    <LoginContext.Consumer>
      {({state, logout}) => (
        <>
          <MyHeader>
            <Logo>
              <Link to={home}>
                <FontAwesomeIcon icon={faYoutube} /> {intl.messages.title}
              </Link>
            </Logo>
            <div className="rightMenu">
              <PcMenu mode="horizontal" selectable={false}>
                <Menu.Item key="home">
                  <Link to={home}>{intl.messages.home}</Link>
                </Menu.Item>
                {
                  state.isLoggedIn &&
                  <Menu.Item key="account">
                      <Link to={`${home}/account`}>{intl.messages.account}</Link>
                  </Menu.Item>
                }
                {
                  state.isLoggedIn &&
                  <Menu.Item key="message">
                      <Link to={`${home}/message`}>{intl.messages.message}</Link>
                  </Menu.Item>
                }
                {
                state.isLoggedIn &&
                <Menu.Item key="logout" onClick={logout}>
                  {intl.messages.logout}
                </Menu.Item>
                }
                <SubMenu title={getLocaleName(intl.locale).name}>
                  {localeLinks}
                </SubMenu>
                <Menu.Item key="theme" onClick={changeTheme}>
              <span>
                <FontAwesomeIcon icon={faAdjust} rotation={180} fixedWidth />
              </span>
                </Menu.Item>
              </PcMenu>
            </div>
            <BarButton onClick={showDrawer}>
              <FontAwesomeIcon icon={faBars} size="lg" />
            </BarButton>
          </MyHeader>
          <MyDrawer
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            getContainer={false}
          >
            <MobileMenu mode="inline" selectable={false}>
              {
                state.isLoggedIn &&
                <Menu.Item key="account">
                    <Link to={`${home}/account`}>{intl.messages.account}</Link>
                </Menu.Item>
              }
              {
                state.isLoggedIn &&
                <Menu.Item key="message">
                    <Link to={`${home}/message`}>{intl.messages.message}</Link>
                </Menu.Item>
              }
              {
                state.isLoggedIn &&
                <Menu.Item key="logout" onClick={logout}>
                  {intl.messages.logout}
                </Menu.Item>
              }
              <SubMenu key="locale" title={getLocaleName(intl.locale).name}>
                {localeLinks}
              </SubMenu>
              <Menu.Item key="theme" onClick={changeTheme}>
            <span>
              <FontAwesomeIcon icon={faAdjust} rotation={180} />
            </span>
              </Menu.Item>
            </MobileMenu>
          </MyDrawer>
        </>
      )}
    </LoginContext.Consumer>
  );
};

const MyHeader = styled(Header)`
  background-color: ${(props) => props.theme.background};
  display: inline-block;
  padding: 0;
  .rightMenu {
    float: right;
    position: relative;
    right: 60px;
  }

  @media (max-width: 767px) {
    .rightMenu {
      display: none;
    }
  }
`;

const Logo = styled.div`
  float: left;
  height: 100%;
  left: 60px;
  position: relative;
  text-align: center;
  & > a {
    color: ${(props) => props.theme.fontColor};
    font-size: 1em;
    letter-spacing: 5px;
  }
  &:hover > a {
    color: ${(props) => props.theme.menuHover} !important;
  }

  @media (max-width: 767px) {
    left: 20px;

    & > a {
      letter-spacing: 2px;
    }
  }
`;

const PcMenu = styled(Menu)`
  background-color: transparent !important;
  border-bottom: 1px solid ${(props) => props.theme.background} !important;
  height: 100%;
  vertical-align: middle;
  & > li > button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: inline;
    margin: 0;
    padding: 0;
    text-decoration: underline;
  }
  & > li > button:hover,
  & > li > button:focus {
    outline: 0;
    text-decoration: none;
  }
  & > li > * {
    color: ${(props) => props.theme.fontColor} !important;
    display: block !important;
  }
  & > li:hover {
    border-bottom: 2px solid #1abc9c !important;
    & > a {
      color: ${(props) => props.theme.menuHover};
    }
  }
  & > li:focus {
    border-bottom: none;
  }
`;

const MobileMenu = styled(Menu)`
  * {
    border: 2px solid ${(props) => props.theme.background} !important;
  }
`;

const BarButton = styled(Button)`
  background-color: transparent;
  border: none;
  color: ${(props) => props.theme.fontColor} !important;
  display: none;
  float: right;
  height: 60%;
  position: relative;
  right: 20px;
  top: 20%;

  &:hover {
    background-color: transparent;
    color: ${(props) => props.theme.menuHover} !important;
  }

  @media (max-width: 767px) {
    display: block;
  }
`;

const MyDrawer = styled(Drawer)`
   .ant-drawer-content-wrapper * { 
    background-color: ${(props) => props.theme.background} !important; 
    border: none;
      color: ${(props) => props.theme.fontColor} !important;
   font-size:16px;
   }
   .ant-drawer-content-wrapper li:hover { 
    path {
    fill: ${(props) => props.theme.menuHover} !important;
    }
   }
   .ant-drawer-content-wrapper *:hover {
    color: ${(props) => props.theme.menuHover} !important;
   }
   .ant-menu-submenu-title {
    .ant-menu-submenu-arrow::before, .ant-menu-submenu-arrow::after {
        background: ${(props) => props.theme.fontColor} !important;
    }
    }
    .ant-menu-submenu-title:hover {
    color: ${(props) => props.theme.menuHover} !important;
    .ant-menu-submenu-arrow::before, .ant-menu-submenu-arrow::after {
        background:  ${(props) => props.theme.menuHover} !important; 
    }
    }
}
`;

export default AppHeader;
