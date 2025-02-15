import React, { createContext, useReducer, useContext } from "react";

import {
SET_SEEN,
SET_CONFRIMED,
SET_ERROR,
SET_VIEW_DETAILS,
SET_REMOVE,
SET_UPDATE,
SET_DETAILS
} from '../actions/customerActions';

const initialState = {
customers: [],
customerDetails: {},
error: null
};

const customerReducer = (state = initialState, action) => {
switch (action.type) {
    case SET_VIEW_DETAILS:
        return {
            ...state,
            customers: action.payload,
            error: null
        };
    case SET_DETAILS:
        return {
            ...state,
            customerDetails: action.payload,
            error: null
        };
    case SET_UPDATE:
        return {
            ...state,
            customers: state.customers.map(customer =>
                customer.id === action.payload.id ? action.payload : customer
            ),
            error: null
        };
    case SET_REMOVE:
        return {
            ...state,
            customers: state.customers.filter(customer => customer.id !== action.payload.id),
            error: null
        };
    case SET_ERROR:
        return {
            ...state,
            error: action.payload
        };
    default:
        return state;
}
};

// Create the context
const CustomerContext = createContext();

// Create the provider
export const CustomerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(customerReducer, initialState);

  return (
    <CustomerContext.Provider value={{ state, dispatch}}>
      {children}
    </CustomerContext.Provider>
  );
};

// Create a custom hook to use the context
export const useCustomerContext = () => {
  const {state,dispatch} = useContext(CustomerContext);
  if (!state || !dispatch) {
    throw new Error("useCustomerContext must be used within a CustomerProvider");
  }
  return {state,dispatch};
};

