import React, {createContext, Dispatch, useEffect, useReducer, useState} from 'react';
import {Dictionary, FailResult, Salt, ServerResponse, User} from "../types";
import requestData from "../utils/requestData";
import config from "../common/config";
import crypto from 'crypto';

export interface LoginState {
    loading: boolean;
    isLoggedIn: boolean;
    userInfo: User;
    error: number;
}

const initialState: LoginState = {
    loading: false,
    isLoggedIn: false,
    userInfo: {
        email: "",
        username: "",
        rank: -1
    },
    error: 0
}

const LOGIN = 'LOGIN' as const;
const LOGINSUCCESS = 'LOGINSUCCESS' as const;
const LOGINFAIL = 'LOGINFAIL' as const;
const LOGOUT = 'LOGOUT' as const;
const login = (email: string, password: string, remember: boolean) => ({
    type: LOGIN,
    email,
    password,
    remember
});
const loginSuccess = (userInfo: User) => ({
    type: LOGINSUCCESS,
    userInfo
});
const loginFail = (error: number) => ({
    type: LOGINFAIL,
    error
});
const logout = () => ({
    type: LOGOUT
});
type LoginAction =
    | ReturnType<typeof login>
    | ReturnType<typeof loginSuccess>
    | ReturnType<typeof loginFail>
    | ReturnType<typeof logout>;

const loginReducer = (state: LoginState, action: LoginAction) => {
    switch(action.type) {
        case LOGIN:
            return { ...state, loading: true, error: 0 };
        case LOGINSUCCESS:
            return { ...state, loading: false, isLoggedIn: true, userInfo: action.userInfo };
        case LOGINFAIL:
            return { ...state, loading: false, isLoggedIn: false, error: action.error };
        case LOGOUT:
            return initialState;
        default:
            throw new Error("Unknown action");
    }
}

export interface LoginContextValue {
    state: LoginState;
    login: (email: string, password: string, remember:boolean) => void;
    logout: () => void;
}

const initialValue = {
    state: initialState,
    login: (email: string, password: string, remember:boolean) => {},
    logout: () => {}
}
const LoginContext = createContext<LoginContextValue>(initialValue);

interface LoginProviderProps {
    children?: React.ReactNode;
}
export const LoginProvider: React.FC<LoginProviderProps> = ({children}) => {
    const [loginState, dispatch] = useReducer(loginReducer, { ...initialState, loading: true });

    const doLogin = (email: string, password: string, remember: boolean) => {
        if (loginState.isLoggedIn)
            return;

        requestData<ServerResponse>(`getSalt${config.serverSuffix}`, {email}, false).then(response => {
            const result = response.data.result as Salt;
            crypto.pbkdf2(password, result.salt, 10000, 256, 'sha512', (err, key) => {
                const params: Dictionary<string> = {
                    email,
                    password: key.toString('base64'),
                    remember: remember ? 'true' : 'false'
                }
                requestData<ServerResponse>(`login${config.serverSuffix}`, params, false).then(response => {
                    const serverResponse = response.data;
                    const result = serverResponse.result as User;
                    dispatch(loginSuccess(result));
                }).catch(e => {
                    let error = -1;
                    if (e.response) {
                        error = (e.response.data.result as FailResult).code;
                    }
                    dispatch(loginFail(error));
                });
            })
        }).catch(e => {
            let error = -1;
            if (e.response) {
                error = (e.response.data.result as FailResult).code;
            }
            dispatch(loginFail(error));
        });
    }

    const doLogout = () => {
        requestData(`logout${config.serverSuffix}`, {}, false);
        dispatch(logout());
    }

    useEffect(() => {
        requestData<ServerResponse>(`isLoggedIn${config.serverSuffix}`, {}, false).then((response) => {
            dispatch(loginSuccess(response.data.result as User));
        }).catch(() => {
            dispatch(loginFail(0));
        })
    }, [])


    return (
      <LoginContext.Provider value={{state: loginState, login: doLogin, logout: doLogout}}>
            {children}
      </LoginContext.Provider>
    )
}

export default LoginContext;