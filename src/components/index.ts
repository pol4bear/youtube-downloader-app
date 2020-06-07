import styled from 'styled-components';
import { Layout } from 'antd';

const { Content } = Layout;

export const Main = styled(Content)`
  flex: 1;
  &.align-center {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
`;

export { default as AppHeader } from './AppHeader';
export { default as AppFooter } from './AppFooter';
