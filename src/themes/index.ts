export type Theme = 'light' | 'dark';
export type ThemeState = {
  theme: Theme;
};

export { default as light } from './light';
export { default as dark } from './dark';
export { default as getTheme } from './getTheme';
