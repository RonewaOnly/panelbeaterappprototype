import { useState, useEffect } from "react";
import { useCustomerContext } from "../redux/reducers/customerReducer";
import { 
  fetchAllCustomers, 
  fetchCustomerById, 
  removeCustomer, 
  updateCustomerStatus 
} from "../redux/actions/customerActions";
import './style.css';

export default function Customers() {
    const { state, dispatch } = useCustomerContext(); // Access context state and dispatch
    const { customers, error } = state; // Get customers and error from state
    
    const [action, setAction] = useState({
        clicked: false,
        id: null,
        colNumber: null,
    });

    useEffect(() => {
        dispatch(fetchAllCustomers()); // Dispatch to fetch customers
    }, [dispatch]);

    const handleRowClick = (customerId, colIndex) => {
        dispatch(fetchCustomerById(customerId)); // Dispatch to fetch details of the clicked customer
        setAction({ clicked: true, id: customerId, colNumber: colIndex });
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

    console.log('Customers:', customers);

    return (
        <div className="customers-container">
            {action.clicked ? (
                <PopSelection
                    id={action.id}
                    customers={customers}
                    colNum={action.colNumber}
                    onConfirm={() => handleUpdateStatus(action.id, "confirmed")}
                    onFixed={() => handleUpdateStatus(action.id, "fixed")}
                    onRemove={handleRemoveCustomer}
                    onViewDetails={(customer) => {
                        dispatch(fetchCustomerById(customer.id)); // Dispatch to view customer details
                    }}
                />
            ) : (
                <table className="customers-table">
                    <thead>
                        <tr>
                            <th>Customer ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Address</th>
                            <th>Problem</th>
                            <th>Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr
                                key={customer.id}
                                className={`customer-row ${customer.status || ''}`}
                                onClick={() => handleRowClick(customer.id, 0)} // Assuming colIndex is 0 here
                            >
                                <td>{customer.id}</td>
                                <td>{customer.firstname}</td>
                                <td>{customer.lastname}</td>
                                <td>{customer.address}</td>
                                <td>{customer.problem}</td>
                                <td>{customer.typeOfCar}</td>
                                <td>{customer.status || 'pending'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export function PopSelection({ id, customers, colNum, onConfirm, onFixed, onRemove, onViewDetails }) {
    const customerIndex = customers.findIndex((customer) => customer.id === id);

    if (customerIndex >= 0) {
        const selectedCustomer = customers[customerIndex];

        return (
            <div className="pop-selection">
                <h3>Customer Details</h3>
                <p>Customer ID: {selectedCustomer.id}</p>
                <p>Name: {selectedCustomer.firstname} {selectedCustomer.lastname}</p>
                <p>Address: {selectedCustomer.address}</p>
                <p>Problem: {selectedCustomer.problem}</p>
                <p>Type of Car: {selectedCustomer.typeOfCar}</p>
                <p>Status: {selectedCustomer.status || 'pending'}</p>
                <p>Column Number: {colNum}</p>

                <div className="action-buttons">
                    <button onClick={onConfirm}>Confirm</button>
                    <button onClick={onFixed}>Mark as Fixed</button>
                    <button onClick={() => onRemove(selectedCustomer.id)}>Remove</button>
                    <button onClick={() => onViewDetails(selectedCustomer)}>View Details</button>
                </div>
            </div>
        );
    } else {
        return <p className="error-message">No customer details available</p>;
    }
}
