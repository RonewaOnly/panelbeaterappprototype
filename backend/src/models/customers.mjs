import OracleDB from 'oracledb';

import { initialize, close } from '../dbConfig.mjs';

class Customer {
    constructor(data = {}) {
        this.CUSTOMER_NAME = data.CUSTOMER_NAME;
        this.CUSTOMER_ADDRESS = data.CUSTOMER_ADDRESS;
        this.CUSTOMER_PHONE = data.CUSTOMER_PHONE;
        this.CAR_MODEL = data.CAR_MODEL;
        this.CAR_YEAR = data.CAR_YEAR;
        this.CAR_COLOR = data.CAR_COLOR;
        this.CAR_PROBLEM_DESCRIPTION = data.CAR_PROBLEM_DESCRIPTION;
        this.CAR_REPAIR_STATUS = data.CAR_REPAIR_STATUS;

    }
    //this save function is not in use on the panel owner side this will be for testing only
    async save(cusData) {
        let connection;
        console.log('From the customer model: ' + cusData.CAR_COLOR);

        try {
            connection = await OracleDB.getConnection();
            const result = await connection.execute(
                `INSERT INTO CUSTOMERS (CUSTOMER_NAME, CUSTOMER_ADDRESS, CUSTOMER_PHONE, CAR_MODEL, CAR_YEAR, CAR_COLOR, CAR_PROBLEM_DESCRIPTION, CAR_REPAIR_STATUS) 
                VALUES (:CUSTOMER_NAME, :CUSTOMER_ADDRESS, :CUSTOMER_PHONE, :CAR_MODEL, :CAR_YEAR, :CAR_COLOR, :CAR_PROBLEM_DESCRIPTION, :CAR_REPAIR_STATUS)`,
                {
                    CUSTOMER_NAME: cusData.CUSTOMER_NAME,
                    CUSTOMER_ADDRESS: cusData.CUSTOMER_ADDRESS,
                    CUSTOMER_PHONE: cusData.CUSTOMER_PHONE,
                    CAR_MODEL: cusData.CAR_MODEL,
                    CAR_YEAR: cusData.CAR_YEAR,
                    CAR_COLOR: cusData.CAR_COLOR,
                    CAR_PROBLEM_DESCRIPTION: cusData.CAR_PROBLEM_DESCRIPTION,
                    CAR_REPAIR_STATUS: cusData.CAR_REPAIR_STATUS
                }

            );
            await connection.commit();
            console.log('Customer saved successfully');
            return result;
        } catch (err) {
            console.error(err);
        } finally {
            // if (connection) {
            // await close(connection);
            // }
        }
    }

    //get the customers details
    static async getCustomerDetails() {
        let connection;
        try {
            connection = await OracleDB.getConnection();
            const result = await connection.execute(
                `SELECT * FROM CUSTOMERS`
            );
            return result.rows;
        } catch (err) {
            console.error(err);
        } finally {
            // if (connection) {
            //     await close(connection);
            // }
        }
    }

    //get the customers details by id
    static async getCustomerDetailsById(id) {
        let connection;
        try {
            connection = await OracleDB.getConnection();
            const result = await connection.execute(
                `SELECT * FROM CUSTOMERS WHERE CUSTOMER_ID = :id`,
                {
                    id
                }
            );
            console.log('what is the resulting action: ', result.rows);
            return result.rows;
        } catch (err) {
            console.error(err);
        } finally {
            // if (connection) {
            //     await close(connection);
            // }
        }
    }

    //update the customer's CAR_REPAIR_STATUS by id and status
    static async updateCustomerCarRepairStatus(id, status) {
        let connection;
        try {
            connection = await OracleDB.getConnection();
            const result = await connection.execute(
                `UPDATE CUSTOMERS SET CAR_REPAIR_STATUS = :status WHERE CUSTOMER_ID = :id
                `,
                {
                    id,
                    status
                },
                { autoCommit: true }
            );
            return result;
        } catch (err) {
            console.error(err);
        } finally {
            // if (connection) {
            //     await close(connection);
            // }
        }
    }
    //remove the customer by id
    static async removeCustomerById(id) {
        let connection;
        try {
            connection = await OracleDB.getConnection();
            const result = await connection.execute(
                `DELETE FROM CUSTOMERS WHERE CUSTOMER_ID = :id`,
                {
                    id
                }
            );
            return result;
        } catch (err) {
            console.error(err);
        } finally {
            // if (connection) {
            //     await close(connection);
            // }
        }
    }
}

export default Customer;