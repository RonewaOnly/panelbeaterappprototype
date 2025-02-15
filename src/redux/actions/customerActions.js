import axios from "axios";

// Action types
export const SET_SEEN = "VIEWED";
export const SET_CONFIRMED = "CONFIRMED";
export const SET_ERROR = "ERROR";
export const SET_VIEW_DETAILS = "VIEW_DETAILS";
export const SET_REMOVE = "REMOVE";
export const SET_UPDATE = "UPDATE";
export const SET_DETAILS = "DETAILS";

// Action creators
export const fetchAllCustomers = () => async (dispatch) => {
    try {
        const response = await axios.get("http://localhost:3000/customers/customers-list");
        console.log("Raw API response:", response);

        dispatch({ type: SET_VIEW_DETAILS, payload: response.data });
    } catch (error) {
        dispatch({ type: SET_ERROR, payload: error.message });
    }
};

export const fetchCustomerById = (id) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:3000/customers/customers-list/${id}`);
        dispatch({ type: SET_DETAILS, payload: response.data });
    } catch (error) {
        dispatch({ type: SET_ERROR, payload: error.message });
    }
}
export const updateCustomerStatus = (id, status) => async (dispatch) => {
    try {
        const response = await axios.put(`http://localhost:3000/customers/customers-list/${id}`, {
            status
        });
        console.log('I was called: ',response.request);
        dispatch({ type: SET_UPDATE, payload: response.data });
    }
    catch (error) {
        dispatch({ type: SET_ERROR, payload: error.message });
    }
}

export const removeCustomer = (id) => async (dispatch) => {
    try {
        const response = await axios.delete(`http://localhost:3000/customers/customers-list/${
            id
        }`);
        dispatch({ type: SET_REMOVE, payload: response.data });
    }
    catch (error) {
        dispatch({ type: SET_ERROR, payload: error.message });
    }
}



