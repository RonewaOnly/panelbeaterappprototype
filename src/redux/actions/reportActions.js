import axios from 'axios';

// Action types
export const SET_REPORT = 'SET_REPORT';
export const SET_ERROR = 'SET_ERROR';
export const SET_GENERATED_REPORT = 'SET_GENERATED_REPORT';

// Action creators
export const fetchReportData = (dateRange) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:3000/api/reports', dateRange);
        dispatch({ type: SET_REPORT, payload: response.data });
    } catch (error) {
        dispatch({ type: SET_ERROR, payload: error.message });
    }
};

export const generateCustomerReport = (reportData) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:3000/api/generate-report', { reportData });
        dispatch({ type: SET_GENERATED_REPORT, payload: response.data });
    } catch (error) {
        dispatch({ type: SET_ERROR, payload: error.message });
    }
};

export const clearError = () => ({ type: SET_ERROR, payload: '' });
