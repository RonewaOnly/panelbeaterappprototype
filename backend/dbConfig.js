import OracleDB from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

const username = process.env.DB_USER
const password = process.env.DB_PASSWORD
const connectString = process.env.DB_HOST+"/"+process.env.DB_PORT+"/"+process.env.DB_NAME
const dbConfig = {
    user: username,
    password: password,
    connectString: connectString
};

async function initialize() {
    try {
        await OracleDB.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Error initializing connection pool', err);
        process.exit(1);
    }
}

async function close() {
    try {
        await OracleDB.getPool().close(10);
        console.log('Connection pool closed');
    } catch (err) {
        console.error('Error closing connection pool', err);
    }
}

export { initialize, close };
