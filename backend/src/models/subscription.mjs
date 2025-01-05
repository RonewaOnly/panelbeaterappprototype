import OracleDB from 'oracledb';

import { initialize, close } from '../dbConfig.mjs';
class Subscription {
    constructor(data={}) {
        this.subscriptionId = data.subscriptionId;
        this.userId = data.userId;
        this.packageName = data.packageName;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.isActive = data.isActive;
    }
    //create unquie subscription_id function to generate random with the prefix of subs
    static createSubscriptionId() {
        return 'subs' + Math.floor(Math.random() * 1000000).toString().padEnd;
    }

    static async create(subscription) {
        const connection = await OracleDB.getConnection();
        const query = `
            INSERT INTO subscriptions (subscription_id, id, package_name, start_date, end_date, is_active)
            VALUES (:subscriptionId, :id, :packageName, TO_DATE(:startDate, 'YYYY-MM-DD'), TO_DATE(:endDate, 'YYYY-MM-DD'), :isActive)
        `;
        const result = await connection.execute(query, {
            subscriptionId: subscription.subscriptionId,
            userId: subscription.userId,
            packageName: subscription.packageName,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            isActive: subscription.isActive
        }, { autoCommit: true });
        return result;
    }

    static async getById(subscriptionId) {
        const connection = await OracleDB.getConnection();
        const query = `
            SELECT * FROM subscriptions WHERE subscription_id = :subscriptionId
        `;
        const result = await connection.execute(query, { subscriptionId });
        return result.rows[0];
    }

    static async update(subscription) {
        const connection = await OracleDB.getConnection();
        const query = `
            UPDATE subscriptions
            SET id = :id, package_name = :packageName, start_date = TO_DATE(:startDate, 'YYYY-MM-DD'), end_date = TO_DATE(:endDate, 'YYYY-MM-DD'), is_active = :isActive
            WHERE subscription_id = :subscriptionId
        `;
        const result = await connection.execute(query, {
            subscriptionId: subscription.subscriptionId,
            userId: subscription.userId,
            packageName: subscription.packageName,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            isActive: subscription.isActive
        }, { autoCommit: true });
        return result;
    }

    static async delete(subscriptionId) {
        const connection = await OracleDB.getConnection();
        const query = `
            DELETE FROM subscriptions WHERE subscription_id = :subscriptionId
        `;
        const result = await connection.execute(query, { subscriptionId }, { autoCommit: true });
        return result;
    }
}

export default Subscription;