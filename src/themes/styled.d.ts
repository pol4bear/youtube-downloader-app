import 'styled-components';
import { Theme } from '.';

declare module 'styled-components' {
    export interface DefaultTheme {
        background: string;
        content_background: string;
        font_color: string;
    }
}