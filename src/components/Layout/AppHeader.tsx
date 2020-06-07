import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Layout, Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faAdjust } from '@fortawesome/free-solid-svg-icons';
import { getLocaleName } from '../../locale';
import config from '../../common/Config';

const { Header } = Layout;
const { SubMenu } = Menu;

type AppHeaderProp = {
  changeTheme?: VoidFunction;
};

const AppHeader: React.FC<AppHeaderProp> = (props) => {
  const intl = useIntl();
  const location = useLocation();
  const subDir: string[] = location.pathname.split(config.baseUrl);
  const home =
    config.baseUrl +
    (subDir.length >= 2 && subDir[1].startsWith('/intl')
      ? `/intl/${intl.locale}`
      : '');

  const changeTheme = () => {
    if (props.changeTheme) props.changeTheme();
  };
  const getLocaleLinks = () => {
    const localeLinks: JSX.Element[] = [];

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

  return (
    <MyHeader>
      <Logo>
        <Link to={home}>
          <FontAwesomeIcon icon={faYoutube} /> {intl.messages.title}
        </Link>
      </Logo>
      <TopMenu mode="horizontal" selectable={false}>
        <Menu.Item key="home">
          <Link to={home}>{intl.messages.home}</Link>
        </Menu.Item>
        <SubMenu title={getLocaleName(intl.locale).name}>
          {getLocaleLinks()}
        </SubMenu>
        <Menu.Item key="theme">
          <button type="button" onClick={changeTheme}>
            <FontAwesomeIcon icon={faAdjust} rotation={180} fixedWidth />
          </button>
        </Menu.Item>
      </TopMenu>
    </MyHeader>
  );
};

const MyHeader = styled(Header)`
  background-color: ${(props) => props.theme.background};
`;

const Logo = styled.div`
  float: left;
  height: 100%;
  margin-left: 10px;
  text-align: center;

  & > a {
    color: ${(props) => props.theme.fontColor};
    font-size: 1em;
    letter-spacing: 5px;
  }

  &:hover > a {
    color: #1abc9c !important;
  }
`;

const TopMenu = styled(Menu)`
  background-color: transparent !important;
  border-bottom: 1px solid ${(props) => props.theme.background} !important;
  float: right;
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
      color: #1abc9c !important;
    }
  }
`;

export default AppHeader;
