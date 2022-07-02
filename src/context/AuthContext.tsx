import React, { createContext, useReducer } from 'react';
import { authReducer } from "./authReducer";

//1 Definir como luce la info del context
export interface AuthState {
    isSignedIn: boolean;
    userName?: string;
    favoriteIcon?: string;
}

//2 Estado Inicial
export const authInitialState: AuthState = {
    isSignedIn: false,
    userName: undefined,
    favoriteIcon: undefined,
}

//4 Esta interfaz lo usaremos para decirle a los componentes hijos como luce y
// la informacion de la que dispone y los métodos que dispone
export interface AuthContextProps {
    authState: AuthState;
    signIn: () => void;
    signOut:() => void;
}

//3 Crear el Contexto
export const AuthContext = createContext({} as AuthContextProps);

//5 Proveedor de la información
export const AuthProvider = ({children}: {children: any }) => {
    
    // 6 Se conecta el Reducer
    const [authState, dispatch] = useReducer(authReducer, authInitialState);

    // 7 Se codifica la accion SignIn
    const signIn = () => {
        dispatch({type: 'signIn'});
    }

    const signOut = () => {
        dispatch({type: 'signOut'});
    }

    return (
        <AuthContext.Provider value={{
            authState,
            signIn,
            signOut,
        }}>
            { children }
        </AuthContext.Provider>
    )
}