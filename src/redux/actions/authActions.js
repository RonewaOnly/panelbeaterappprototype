import axios from 'axios';

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const REFRESH_SUCCESS = "REFRESH_SUCCESS";
export const REFRESH_FAILED = "REFRESH_FAILED";

// Action function for logging in a user
export const login = (email, password) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('http://localhost:3000/login/', {
                email,
                password
            });

            // Save both access & refresh tokens
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);

            dispatch({ type: LOGIN_SUCCESS, payload: response.data });
            console.log('Login successful: ', response.data);
        } catch (error) {
            dispatch({ type: LOGIN_FAILED, payload: error });
            console.log('Login failed: ', error);
        }
    };
};

// Logout function
export const logout = () => {
    return (dispatch) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch({ type: LOGOUT_SUCCESS });
    };
};

export const refreshToken = () => {
    return async (dispatch) => {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            dispatch(logout());
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/refresh", { refreshToken });

            // Store new tokens
            localStorage.setItem("accessToken", response.data.accessToken);
            dispatch({ type: REFRESH_SUCCESS, payload: response.data });

            console.log("Token refreshed:", response.data);
            return response.data.accessToken;
        } catch (error) {
            dispatch({ type: REFRESH_FAILED });
            console.error("Token refresh failed:", error);
            dispatch(logout());
            return null;
        }
    };
};
