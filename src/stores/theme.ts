import { ReducerAction } from "react";

type ThemeState = {
    theme: string
};

const initialState:ThemeState = {
    theme: 'theme-light'
};

const SET = 'theme/SET' as const;
const CHANGE = 'theme/CHANGE' as const;

export const set = (theme:string) => ({
    type: SET,
    payload: theme
});
export const change = () => ({type: CHANGE});

type ThemeAction = ReturnType<typeof set> | ReturnType<typeof change>;

function theme(state:ThemeState = initialState, action:ThemeAction) {
    switch(action.type) {
        case SET:
            if (action.payload === 'theme-light' || action.payload === 'theme-dark')
                return { theme: action.payload };
            else
                return state;
        case CHANGE:
            return { theme: state.theme === 'theme-light' ? 'theme-dark' : 'theme-light' };
        default:
            return state;
    }
}

export default theme;