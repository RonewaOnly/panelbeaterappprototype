import { LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT_SUCCESS, REFRESH_SUCCESS } from '../actions/authActions';
import { createContext, useContext, useReducer,useEffect } from 'react';
import axios from "axios";

const initialState = {
    isAuthenticated: false,
    user: null,
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    error: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.session.user,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
                error: null
            };
        case REFRESH_SUCCESS:
            return {
                ...state,
                accessToken: action.payload.accessToken,
            };
        case LOGIN_FAILED:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                accessToken: null,
                refreshToken: null,
                error: action.payload
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                accessToken: null,
                refreshToken: null,
                error: null
            };
        default:
            return state;
    }
};

// Create a context for authentication
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Axios instance for requests
    const api = axios.create({
        baseURL: "http://localhost:3000", // Your backend URL
    });

    // **Function to Refresh Token**
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const refreshAccessToken = async () => {
        try {
            const response = await axios.post(`${api.defaults.baseURL}/refresh-token`, {
                refreshToken: state.refreshToken,
            });

            // Update token in state and localStorage
            localStorage.setItem("token", response.data.accessToken);
            dispatch({ type: LOGIN_SUCCESS, payload: response.data });

            return response.data.accessToken;
        } catch (error) {
            console.error("Token refresh failed", error);
            dispatch({ type: LOGOUT_SUCCESS });
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
        }
    };

    // **Attach Token & Handle Expired Tokens Automatically**
    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(
            async (config) => {
                if (state.token) {
                    config.headers["Authorization"] = `Bearer ${state.token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401 && state.refreshToken) {
                    // If Unauthorized, try refreshing token
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        error.config.headers["Authorization"] = `Bearer ${newToken}`;
                        return axios(error.config); // Retry original request
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [state.token, state.refreshToken, api.interceptors.request, api.interceptors.response, refreshAccessToken]);

    return (
        <AuthContext.Provider value={{ state, dispatch, api }}>
            {children}
        </AuthContext.Provider>
    );
}
// Hook to use Auth Context
const useAuth = () => {
    return useContext(AuthContext);
};

export { AuthProvider, authReducer, useAuth };
