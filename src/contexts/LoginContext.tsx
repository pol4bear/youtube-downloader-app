import React, {createContext, useReducer} from 'react';
import {Dictionary, FailResult, ServerResponse, User} from "../types";
import requestData from "../utils/requestData";
import config from "../common/config";

export interface LoginState {
    loading: boolean;
    isLoggedIn: boolean;
    userInfo: User;
    error: number;
    login: (id: string, pw: string) => void;
    logout: () => void;
}
const initialState: LoginState = {
    loading: false,
    isLoggedIn: false,
    userInfo: {
        email: "",
        username: "",
        rank: -1
    },
    error: 0,
    login: (id, pw) => {},
    logout: () => {}
}

const LOGIN = 'LOGIN' as const;
const LOGINDONE = 'LOGINDONE' as const;
const LOGOUT = 'LOGOUT' as const;
const login = () => ({
    type: LOGIN,
});
const loginDone = (error?: number) => ({
    type: LOGINDONE,
    error: error ? error : 0
});
const logout = () => ({
    type: LOGOUT
});
type LoginAction =
    | ReturnType<typeof login>
    | ReturnType<typeof loginDone>
    | ReturnType<typeof logout>

const loginReducer = (state: LoginState, action: LoginAction) => {
    switch(action.type) {
        case LOGIN:
            return { ...state, loading: true, error: 0 }
        case LOGINDONE:
            return { ...state, loading: false, error: action.error }
        case LOGOUT:
            return initialState;
        default:
            throw new Error("Unknown action");
    }
}


const LoginContext = createContext(initialState);

interface LoginProviderProps {
    children?: React.ReactNode;
}
export const LoginProvider: React.FC<LoginProviderProps> = ({children}) => {
    const [loginState, dispatch] = useReducer(loginReducer, initialState);
    loginState.login = (id, pw) => {
        dispatch(login());
        const params: Dictionary<string> = {
            id,
            pw
        }
        requestData<ServerResponse>(`login${config.serverSuffix}`, params, false).then(response => {
            const serverResponse = response.data;
            const result = serverResponse.result as User;
            loginState.isLoggedIn = true;
            loginState.userInfo = result;
            dispatch(loginDone());
        }).catch(e => {
            let error = -1;
            if (e.response) {
                error = (e.response.result as FailResult).code;
            }
            dispatch(loginDone(error));
        });
    }
    loginState.logout = () => {
        dispatch(logout());
    }

    return (
        <LoginContext.Provider value={loginState}>
            {children}
        </LoginContext.Provider>
    )
}

export default LoginContext;