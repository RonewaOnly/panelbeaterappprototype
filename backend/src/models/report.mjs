import OracleDB from 'oracledb';

import { initialize, close } from '../dbConfig.mjs';
class Report {
    constructor( data={  }) {
        this.customerId = data.customerId;
        this.serviceRequest = data.serviceRequest;
        this.requestDate = data.requestDate;
        this.status = data.status;
        this.responseTime = data.responseTime;
        this.satisfactionRating = data.satisfactionRating;
    }

    static async create(reportData) {
        const connection = await OracleDB.getConnection();
        const sql = `INSERT INTO reports (customerId, serviceRequest, requestDate, status, responseTime, satisfactionRating) 
                                VALUES (:customerId, :serviceRequest,TO_DATE(:requestDate, 'YYYY-MM-DD'), :status, :responseTime, :satisfactionRating)`;
        const binds = { ...reportData };
        await connection.execute(sql, binds, { autoCommit: true });
    }

    static async findById(id) {
        const connection = await OracleDB.getConnection();
        const sql = `SELECT * FROM reports WHERE id = :id`;
        const result = await connection.execute(sql, [id]);
        return result.rows[0];
    }

    static async update(id, reportData) {
        const connection = await OracleDB.getConnection();
        const sql = `UPDATE reports SET customerId = :customerId, serviceRequest = :serviceRequest, requestDate = :requestDate, 
                                status = :status, responseTime = :responseTime, satisfactionRating = :satisfactionRating WHERE id = :id`;
        const binds = { ...reportData, id };
        await connection.execute(sql, binds, { autoCommit: true });
    }

    static async delete(id) {
        const connection = await OracleDB.getConnection();
        const sql = `DELETE FROM reports WHERE id = :id`;
        await connection.execute(sql, [id], { autoCommit: true });
    }
}

export default Report;