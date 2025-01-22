import { useState } from "react";
import { CUSTOMERS } from "../Customers";
import './style.css';

export default function Customers() {
    const [customers, setCustomers] = useState(CUSTOMERS);
    const [action, setAction] = useState({
        clicked: false,
        id: null,
        colNumber: null,
    });

    const handleRowClick = (customerId, colIndex) => {
        setAction({ clicked: true, id: customerId, colNumber: colIndex });
    };

    const handleRemoveCustomer = (customerId) => {
        setCustomers(customers.filter((customer) => customer.id !== customerId));
        setAction({ clicked: false, id: null, colNumber: null });
    };

    return (
        <div className="customers-container">
            {action.clicked ? (
                <PopSelection
                    id={action.id}
                    customers={customers}
                    colNum={action.colNumber}
                    onConfirm={() => alert("Action confirmed!")}
                    onFixed={() => alert("Marked as Fixed!")}
                    onRemove={handleRemoveCustomer}
                    onViewDetails={(details) => alert(JSON.stringify(details, null, 2))}
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
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer, index) => (
                            <tr
                                key={customer.id}
                                className="customer-row"
                                onClick={() => handleRowClick(customer.id, index)}
                            >
                                <td>{customer.id}</td>
                                <td>{customer.firstname}</td>
                                <td>{customer.lastname}</td>
                                <td>{customer.address}</td>
                                <td>{customer.problem}</td>
                                <td>{customer.typeOfCar}</td>
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