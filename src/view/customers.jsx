import { useState, useEffect } from "react";
import {
    fetchAllCustomers,
    fetchCustomerById,
    removeCustomer,
    updateCustomerStatus
} from "../redux/actions/customerActions";
import { useCustomerContext } from "../redux/reducers/customerReducer";
import './style.css';

export default function Customers() {
    const [state, dispatch] = useCustomerContext();
    console.log('the state values: ',useCustomerContext());

    const [action, setAction] = useState({
        clicked: false,
        id: null,
        colNumber: null,
    });

    console.log('State value:', state);

    useEffect(() => {
        fetchAllCustomers()(dispatch);
        //dispatch(fetchAllCustomers())
    }, [state,dispatch]); // Removed `state` to prevent unnecessary re-renders

    const handleRowClick = (customerId) => {
        setAction({ clicked: true, id: customerId });
        dispatch(fetchCustomerById(customerId));
    };

    const handleRemoveCustomer =  (customerId) => {
         removeCustomer(customerId)(dispatch); // Ensure async completion
        setAction({ clicked: false, id: null, colNumber: null });
    };

    const handleUpdateStatus =  (customerId, status) => {
         updateCustomerStatus(customerId, status)(dispatch); // Ensure async completion
    };

    if (state.error) {
        return <div className="error-message">Error: {state.error}</div>;
    }

    return (
        <div className="customers-container">
            {action.clicked ? (
                <PopSelection
                    id={action.id}
                    customers={state.customers}
                    colNum={action.colNumber}
                    onConfirm={() => handleUpdateStatus(action.id, "VIEWED")}
                    onFixed={() => handleUpdateStatus(action.id, "COMPLETED")}
                    onRemove={handleRemoveCustomer}
                    onViewDetails={(customer) => {
                        dispatch(fetchCustomerById(customer));
                        alert(customer);
                    }}
                />
            ) : (
                <table className="customers-table">
                    <thead>
                        <tr>
                            <th>Customer ID</th>
                            <th>Full Name</th>
                            <th>Cell Number</th>
                            <th>Problem</th>
                            <th>Model</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.customers.map((customer, index) => (
                            <tr
                                key={index}
                                className={`customer-row ${customer[8] || ''}`}
                                onClick={() => handleRowClick(customer[0])}
                            >
                                <td>{customer[0]}</td>
                                <td>{customer[1]}</td>
                                <td>{customer[3]}</td>
                                <td>{customer[7]}</td>
                                <td>{customer[5]}</td>
                                <td>{customer[8] || 'pending'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export function PopSelection({ id, customers, colNum, onConfirm, onFixed, onRemove, onViewDetails }) {
    const selectedCustomer = customers.find((customer) => customer[0] === id);

    if (!selectedCustomer) {
        return <p className="error-message">No customer details available</p>;
    }

    //console.log('Selected customer:', selectedCustomer);

    return (
        <div className="pop-selection">
            <h3>Customer Details</h3>
            <p>Customer ID: {selectedCustomer[0]}</p>
            <p>Full Name: {selectedCustomer[1]}</p>
            <p>Address: {selectedCustomer[2]}</p>
            <p>Cell Number: {selectedCustomer[3]}</p>
            <p>Car Model: {selectedCustomer[4]}</p>
            <p>Status: {selectedCustomer[8] || 'pending'}</p>
            <p>Column Number: {colNum}</p>

            <div className="action-buttons">
                <button onClick={onConfirm}>Confirm</button>
                <button onClick={onFixed}>Mark as Fixed</button>
                <button onClick={() => onRemove(selectedCustomer[0])}>Remove</button>
                <button onClick={() => onViewDetails(selectedCustomer)}>View Details</button>
            </div>
        </div>
    );
}
