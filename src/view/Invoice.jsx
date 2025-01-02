import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './style.css'; // Assuming you have a separate CSS file for styling

const InvoiceForm = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        invoiceDate: '',
        items: [{ description: '', quantity: '', price: '' }],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const updatedItems = [...formData.items];
        updatedItems[index][name] = value;
        setFormData((prevData) => ({
            ...prevData,
            items: updatedItems,
        }));
    };

    const handleAddItem = () => {
        setFormData((prevData) => ({
            ...prevData,
            items: [...prevData.items, { description: '', quantity: '', price: '' }],
        }));
    };

    const handleRemoveItem = (index) => {
        const updatedItems = formData.items.filter((_, i) => i !== index);
        setFormData((prevData) => ({
            ...prevData,
            items: updatedItems,
        }));
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Invoice', 20, 20);
        doc.setFontSize(12);

        // Customer Information
        doc.text(`Customer: ${formData.customerName}`, 20, 40);
        doc.text(`Invoice Date: ${formData.invoiceDate}`, 20, 50);

        // Table Header
        doc.text('Description', 20, 70);
        doc.text('Quantity', 120, 70);
        doc.text('Price', 160, 70);

        // Table Content
        let yPosition = 80;
        formData.items.forEach((item, index) => {
            doc.text(item.description, 20, yPosition);
            doc.text(item.quantity, 120, yPosition);
            doc.text(item.price, 160, yPosition);
            yPosition += 10;
        });
        const fileName = `invoice-${formData.customerName.replace(/\s+/g, '_')}-${formData.invoiceDate}.pdf`;
        doc.save(fileName);
    };

    return (
        <div className="invoice-form-container">
            <h2 className="form-title">Invoice Form</h2>
            <form className="invoice-form">
                <div className="form-group">
                    <label className="form-label">Customer Name</label>
                    <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Invoice Date</label>
                    <input
                        type="date"
                        name="invoiceDate"
                        value={formData.invoiceDate}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                    />
                </div>

                <h3 className="items-title">Items</h3>
                {formData.items.map((item, index) => (
                    <div key={index} className="item">
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, e)}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, e)}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, e)}
                                className="form-input"
                                required
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="remove-item-btn"
                        >
                            Remove Item
                        </button>
                    </div>
                ))}

                <button type="button" onClick={handleAddItem} className="add-item-btn">
                    Add Item
                </button>
            </form>

            <button onClick={generatePDF} className="generate-pdf-btn">
                Generate Invoice PDF
            </button>
        </div>
    );
};

export default InvoiceForm;
