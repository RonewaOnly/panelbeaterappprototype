import express from 'express';
import Customer from '../models/customer.mjs';

const router = express.Router();

// Route to get all customers
router.get('/customers', async (req, res) => {
    try {
        const customer = new Customer();
        const customers = await customer.getCustomerDetails();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to get customer details by id
router.get('/customers/:id', async (req, res) => {
    try {
        const customer = new Customer();
        const customerDetails = await customer.getCustomerDetailsById(req.params.id);
        res.json(customerDetails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to update customer's car repair status by id
router.put('/customers/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const customer = new Customer();
        const result = await customer.updateCustomerCarRepairStatus(req.params.id, status);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;