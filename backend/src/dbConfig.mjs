import OracleDB from 'oracledb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Retrieve environment variables
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const connectString = `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
console.log(username);


// Database configuration object
const dbConfig = {
    user: username,
    password: password,
    connectString: connectString,
};

// Initialize the connection pool
async function initialize() {
    try {
        // Create the connection pool
        await OracleDB.createPool(dbConfig);
        console.log('Connection pool started successfully');
    } catch (err) {
        console.error('Error initializing connection pool:', err.message);
        process.exit(1); // Exit the process with an error code
    }
}

// Close the connection pool
async function close() {
    try {
        // Close the pool with a timeout
        await OracleDB.getPool().close(10);
        console.log('Connection pool closed successfully');
    } catch (err) {
        console.error('Error closing connection pool:', err.message);
    }
}

// Export the initialize and close functions
export  { initialize, close };
