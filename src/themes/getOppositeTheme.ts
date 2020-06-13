import { DefaultTheme } from 'styled-components';
import { dark, light } from './index';

const getOppositeTheme = (theme: DefaultTheme): DefaultTheme => {
  return theme === light ? dark : light;
};

export default getOppositeTheme;
