import OracleDB from 'oracledb';
const dbConfig = {
    user: 'your_username',
    password: 'your_password',
    connectString: 'localhost/XEPDB1'
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

module.exports = {
    initialize,
    close
};