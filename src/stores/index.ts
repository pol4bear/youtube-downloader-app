import {combineReducers} from 'redux';
import theme from './theme';

const rootReducer = combineReducers({
    theme
});
export default  rootReducer;
export type RootState = ReturnType<typeof rootReducer>;