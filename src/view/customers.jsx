import { useState, useEffect } from "react";
// import { customerReducer, useCustomerContext } from "../redux/reducers/customerReducer";
import {
    fetchAllCustomers,
    fetchCustomerById,
    removeCustomer,
    updateCustomerStatus
} from "../redux/actions/customerActions";
import './style.css';
import { useSelector, useDispatch } from "react-redux";

export default function Customers() {
    const dispatch = useDispatch();
    const customers = useSelector((state) =>
        state.customers.customers
    ); // Get customers and error from state
    const error = useSelector((state) => state.error); // Get error from state
    console.log("Customers state dubugging:", customers);  // Debugging


    const [action, setAction] = useState({
        clicked: false,
        id: null,
        colNumber: null,
    });

    console.log("Dispatching fetchAllCustomers");
    dispatch(fetchAllCustomers()); // Dispatch to fetch customers

    const handleRowClick = (customerId) => {
        setAction({ clicked: true, id: customerId });
        dispatch(fetchCustomerById(customerId)); // Dispatch to fetch details of the clicked customer
    };

    const handleRemoveCustomer = async (customerId) => {
        dispatch(removeCustomer(customerId)); // Dispatch to remove a customer
        setAction({ clicked: false, id: null, colNumber: null });
    };

    const handleUpdateStatus = async (customerId, status) => {
         dispatch(updateCustomerStatus(customerId, status)); // Dispatch to update customer status
    };

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }


    return (
        <div className="customers-container">
            {action.clicked ? (
                <PopSelection
                    id={action.id}
                    customers={customers}
                    colNum={action.colNumber}
                    onConfirm={() => handleUpdateStatus(action.id, "VIEWED")}
                    onFixed={() => handleUpdateStatus(action.id, "COMPLETED")}
                    onRemove={handleRemoveCustomer}
                    onViewDetails={(customer) => {
                        dispatch(fetchCustomerById(customer)); // Dispatch to view customer details
                        alert(customer)
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
                        {customers.map((customer,index) => (
                            console.log('this attriubate of the map function',index),
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
    const customerIndex = customers.findIndex((customer) => customer[0] === id);
    console.log('array in pop up',customerIndex)


    if (customerIndex >= 0) {
        const selectedCustomer = customers[customerIndex];
        console.log('found user: ',selectedCustomer)

        return (
            <div className="pop-selection">
                <h3>Customer Details</h3>
                <p>Customer ID: {selectedCustomer[0]}</p>
                <p>FullName: {selectedCustomer[1]}</p>
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
    } else {
        return <p className="error-message">No customer details available</p>;
    }
}
