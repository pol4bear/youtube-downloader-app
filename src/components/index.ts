import styled from 'styled-components';

export const Main = styled.main`
    flex: 1;
    &.align-center {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
`;

export {default as AppHeader} from './AppHeader';
export {default as AppFooter} from './AppFooter';
export {default as SearchForm} from './SearchForm';