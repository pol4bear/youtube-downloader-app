import { DefaultTheme } from 'styled-components';
import light from './light';
import dark from './dark';
import { Theme } from '.';

/**
 * Get theme info by theme name.
 *
 * @param theme
 * @return theme info
 */
const getTheme = (theme: Theme): DefaultTheme => {
  switch (theme) {
    case 'light':
      return light;
    case 'dark':
      return dark;
    default:
      return light;
  }
};

export default getTheme;
