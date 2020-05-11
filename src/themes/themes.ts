import {DefaultTheme} from 'styled-components';
import {Dictionary} from '../common/Types';
import light from './light'
import dark from './dark';

const themes:Dictionary<DefaultTheme> = {
    light: light,
    dark: dark
}

export default themes;