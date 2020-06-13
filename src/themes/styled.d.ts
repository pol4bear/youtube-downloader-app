import 'styled-components';

// Override DefaultTheme object of styled-components.
declare module 'styled-components' {
  export interface DefaultTheme {
    name: string;
    background: string;
    contentBackground: string;
    fontColor: string;
    menuHover: string;
  }
}
