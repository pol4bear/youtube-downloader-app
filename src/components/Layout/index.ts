import styled from 'styled-components';
import { Layout } from 'antd';

const { Content } = Layout;

export const Main = styled(Content)`
  background-color: transparent;
  display: flex;
`;

export { default as AppHeader } from './AppHeader';
export { default as AppFooter } from './AppFooter';
