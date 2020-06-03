import styled from 'styled-components';
import {Layout} from 'antd';

const {Content} = Layout;

export const Main = styled(Content)`
    flex: 1;
    &.align-center {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`;

export {default as AppHeader} from './AppHeader';
export {default as AppFooter} from './AppFooter';
export {default as SearchForm} from './SearchForm';