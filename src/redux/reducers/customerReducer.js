import React, { createContext, useReducer, useContext } from "react";
import { SET_VIEW_DETAILS, SET_DETAILS, SET_UPDATE, SET_REMOVE, SET_ERROR, SET_SEEN, SET_CONFIRMED } from "../actions/customerActions";

const initialState = {
  customers: [],
  customerDetails: {},
  error: null
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VIEW_DETAILS:
      console.log("SET_VIEW_DETAILS payload", action.payload);  // Debugging

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
        customers: state.customers.map((customer) => 
          customer.id === action.payload.id ? { ...customer, status: action.payload.status } : customer
        ),
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
       break;
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

  const value = [state, dispatch ];

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

// Custom hook to use the context
const useCustomerContext = () => {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error("useCustomerContext must be used within a CustomerProvider");
  }

  return context;
};

export { CustomerProvider, useCustomerContext, customerReducer };