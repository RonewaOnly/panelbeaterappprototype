import React, { createContext, useReducer, useContext } from "react";

// Action Types - should be constants
export const SET_SEEN = "SET_SEEN";
export const SET_CONFIRMED = "SET_CONFIRMED";
export const SET_ERROR = "SET_ERROR";
export const SET_VIEW_DETAILS = "SET_VIEW_DETAILS";
export const SET_REMOVE = "SET_REMOVE";
export const SET_UPDATE = "SET_UPDATE";
export const SET_DETAILS = "SET_DETAILS";

const initialState = {
  customers: [],
  customerDetails: {},
  error: null
};

const customerReducer = (state=initialState, action) => {
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
        customers: state.customers.filter(customer => customer.id !== action.payload),
        error: null
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case SET_SEEN:
    case SET_CONFIRMED:
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id 
            ? { ...customer, [action.type.toLowerCase().slice(4)]: true }
            : customer
        ),
        error: null
      };
    default:
      return state;
  }
};

// Create the context with a default value
const CustomerContext = createContext();

// Create the provider component with proper props typing
const CustomerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(customerReducer, initialState);

  const value = { state, dispatch };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

// Custom hook to use the context
const useCustomerContext = () => {
  const context = useContext(CustomerContext);
  
  if (context === null) {
    throw new Error("useCustomerContext must be used within a CustomerProvider");
  }
  
  return context;
};

export { CustomerProvider, useCustomerContext, CustomerContext ,customerReducer};