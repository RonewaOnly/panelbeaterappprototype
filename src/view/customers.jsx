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

    return (
        <div className="customers-container">
            {action.clicked ? (
                <PopSelection
                    id={action.id}
                    customers={customers}
                    colNum={action.colNumber}
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

export function PopSelection({ id, customers, colNum }) {
    const customerIndex = customers.findIndex((customer) => customer.id === id);

    if (customerIndex >= 0) {
        const selectedCustomer = customers[customerIndex];
        return (
            <div className="pop-selection">
                <p>
                    Customer Details: {selectedCustomer.firstname}{" "}
                    {selectedCustomer.lastname}, Column Number: {colNum}
                </p>
            </div>
        );
    } else {
        return <p className="error-message">No customer details available</p>;
    }
}
