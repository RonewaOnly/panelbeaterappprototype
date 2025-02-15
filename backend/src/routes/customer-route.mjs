import express from 'express';
import Customer from '../models/customers.mjs';

const router = express.Router();

// Route to add a new customer just for testing
router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const customer = new Customer(req.body);
        await customer.save(req.body);
        res.status(201).send(customer);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/customers-list/:id', async (req, res) => {
    console.log('Request received for customer ID:', req.params.id); // ✅ Debugging Log

    try {

        const customerDetails = await Customer.getCustomerDetailsById(req.params.id);

        if (!customerDetails) {
            console.log('Customer not found');
            return res.status(404).json({ error: 'Customer not found.' });
        }

        console.log('Customer found:', customerDetails);
        res.status(200).json(customerDetails);
    } catch (err) {
        console.error('Error fetching customer:', err.message);
        res.status(500).json({ error: err.message });
    }
});




// Route to update customer's car repair status by id
router.put('/customers-list/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const customer = new Customer();
        const result = await customer.updateCustomerCarRepairStatus(req.params.id, status);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to get all customers
router.get('/customers-list', async (req, res) => {
    const customerId = req.query.id;

    if (customerId) {
        // Fetch a single customer by ID
        console.log('Fetching customer details for ID:', customerId);

        try {
            const customerDetails = await Customer.getCustomerDetailsById(customerId);

            if (!customerDetails.length) {
                return res.status(404).json({ error: 'Customer not found.' });
            }

            return res.status(200).json(customerDetails);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    } else {
        // Fetch all customers
        console.log('Fetching all customers...');
        try {
            const customers = await Customer.getCustomerDetails();
            return res.status(200).json(customers);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
});


export default router;