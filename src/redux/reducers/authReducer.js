import { LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT_SUCCESS } from '../actions/authActions';
import { useContext, createContext, useReducer } from 'react';

const initialState = {
    isAuthenticated: false,
    user: null,
    error: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                error: null
            };
        case LOGIN_FAILED:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                error: action.payload
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                error: null
            };
        default:
            return state;
    }
};

//create a context for the auth
const AuthContext = createContext();
//create a provider for the auth
const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
};

//wrap the authReducer in a useContext
const useAuth = () => {
    return useContext(AuthContext);
    };


export  {AuthProvider,authReducer,useAuth};