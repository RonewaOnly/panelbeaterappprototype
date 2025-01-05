import axios from 'axios';

export const LOGIN_SUCCESS = "LOGIN SUCCESS";
export const LOGIN_FAILED = "LOGIN FAILED";
export const LOGOUT_SUCCESS = "LOGOUT SUCCESS";

// Action function for logging in a user
export const login = (email, password) => {
    return (dispatch) => {
        // Make a POST request to authenticate the user
        axios.post('http://localhost:3000/login/', {
            email,
            password
        })
        .then(response => {
            // If the user is authenticated, save the token in localStorage
            localStorage.setItem('token', response.data.token);

            // Dispatch the success action to update the app state
            dispatch({ type: LOGIN_SUCCESS, payload: response.data });
            console.log('Login successful: ', response.data);
        })
        .catch(error => {
            // If authentication fails, dispatch the failure action
            dispatch({ type: LOGIN_FAILED, payload: error });
            console.log('Login failed: ', error);
        });
    };
};

// Logout function
export const logout = () => {
    return (dispatch) => {
        // Remove the token from localStorage
        localStorage.removeItem('token');

        // Dispatch the logout success action to update the state
        dispatch({ type: LOGOUT_SUCCESS });
    };
};
