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
router.put('/customer-list/:id/:status', async (req, res) => {
    const customerId = req.params.id;
    const status = req.params.status;  // Getting status from the URL

    console.log(`Updating customer ${customerId} to status: ${status}`);

    console.log('the object values:', req.params);
    // Check if status is missing
    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }


    try {
        const result = await Customer.updateCustomerCarRepairStatus(customerId, status);
        
        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        
        res.status(200).json({ message: 'Customer status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
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

//router to detele the customer by id
router.delete('/delete-customer/:id', async (req, res) => {
    const customerId = req.params.id;
    console.log('Deleting customer with ID:', customerId);
    try {
        const result = await Customer.removeCustomerById(customerId);
        if (result.rowsAffected === 0) {
            console.log('Customer not found');
            return res.status(404).json({ error: 'Customer not found' });
        }

        console.log('Customer deleted successfully the rsult:', result);
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/customers-lists/test', (req, res) => {
    res.send('Route is working!');
});

console.log(router.stack.map(r => r.route));




export default router;