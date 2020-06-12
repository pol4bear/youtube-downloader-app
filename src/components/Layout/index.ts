import styled from 'styled-components';
import { Layout } from 'antd';

const { Content } = Layout;

export const Main = styled(Content)`
  background-color: transparent;
  display: flex;
`;

export { default as AppHeader } from './AppHeader';
export { default as AppFooter } from './AppFooter';
export { default as CenterAligner } from './CenterAligner';
export { default as ErrorContent } from './ErrorContent';
export { default as LoadWrapper } from './LoadWrapper';
export { default as NotFound } from './NotFound';
export { default as NotAvailable } from './NotAvailable';
