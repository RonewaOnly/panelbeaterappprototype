import React, { createContext, useReducer, useContext } from 'react';
import { SET_REPORT, SET_GENERATED_REPORT, SET_ERROR } from '../actions/reportActions';
const initialState = {
    report: [],
    generatedReport: null,
    error: '',
};

const reportReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_REPORT:
            return { ...state, report: action.payload, error: '' };
        case SET_GENERATED_REPORT:
            return { ...state, generatedReport: action.payload, error: '' };
        case SET_ERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

//create provider and useContext for the reportReducer
const ReportContext = createContext();
const ReportProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reportReducer, initialState);
    return (
        <ReportContext.Provider value={{ state, dispatch }}>
            {children}
        </ReportContext.Provider>
    );
}

//create a custom hook to use the reportReducer state
const useReport = () => {
    const { state, dispatch } = useContext(ReportContext);
    return [state, dispatch];
}

export  {reportReducer, ReportProvider, useReport};
