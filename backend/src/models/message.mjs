import OracleDB from 'oracledb';
import { initialize, close } from '../dbConfig.mjs';

class Message {
    constructor(data = {}) {
        this.id = data.id;
        this.sender = data.sender;
        this.receiver = data.receiver;
        this.message = data.message;
        this.replies = data.replies || []; // handle replies as an array
        this.date = data.date;
        this.time = data.time;
        this.isRead = data.isRead ||0;
        this.isReply = data.isReply;
        this.profileImg = data.profileImg||"";
    }

    // Create a new message in the messages table
    static async create(messageData) {
        const connection = await OracleDB.getConnection();
        const result = await connection.execute(
            `INSERT INTO message ( message_id, sender, receiver, message, date_sent, time_stamp, isRead, isReply, profileImg) 
             VALUES (:message_id, :sender, :receiver, :message, :date_sent, :time_stamp, :isRead, :isReply, :profileImg)`,
            {
                message_id: messageData.message_id,
                sender: messageData.sender,
                receiver: messageData.receiver,
                message: messageData.message,
                date_sent: messageData.date_sent.toISOString().split('T')[0],
                time_stamp: messageData.time_stamp,
                isRead: messageData.isRead ? 1 : 0,
                isReply: messageData.isReply ? 1 : 0,
                profileImg: messageData.profileImg
            }
        );
        // Get the ID of the newly created message
        const messageId = result.lastRowid;
        
        // Insert replies into the Replies table if any exist
        if (messageData.replies && messageData.replies.length > 0) {
            await Promise.all(
                messageData.replies.map(reply => {
                    return connection.execute(
                        `INSERT INTO replies (message_id, sender, receiver, message, date_sent, time_stamp) 
                         VALUES (:message_id, :sender, :receiver, :message, :date_sent, :time_stamp)`,
                        {
                            message_id: messageId,
                            sender: reply.sender,
                            receiver: reply.receiver,
                            message: reply.message,
                            date: reply.date,
                            time: reply.time
                        }
                    );
                })
            );
        }

        return result;
    }

    // Get message by ID
    static async getById(id) {
        const connection = await OracleDB.getConnection();
        const result = await connection.execute(
            `SELECT * FROM message WHERE id = :id`,
            { id }
        );

        const message = result.rows[0];
        if (message) {
            // Get the replies for the message
            const repliesResult = await connection.execute(
                `SELECT * FROM replies WHERE message_id = :message_id`,
                { message_id: message.id }
            );
            message.replies = repliesResult.rows;
        }
        return message;
    }

    // Get all messages
    static async getAll() {
        const connection = await OracleDB.getConnection();
        const result = await connection.execute(`SELECT * FROM message`);
        
        // Attach replies for each message
        const messages = result.rows;
        for (let message of messages) {
            const repliesResult = await connection.execute(
                `SELECT * FROM replies WHERE message_id = :message_id`,
                { message_id: message.id }
            );
            message.replies = repliesResult.rows;
        }
        return messages;
    }

    // Update a message and its replies
    static async update(id, messageData) {
        const connection = await OracleDB.getConnection();
        const result = await connection.execute(
            `UPDATE message SET sender = :sender, receiver = :receiver, message = :message, date_sent = :date_sent, time_stamp = :time_stamp, isRead = :isRead, isReply = :isReply, profileImg = :profileImg WHERE id = :id`,
            {
                id,
                sender: messageData.sender,
                receiver: messageData.receiver,
                message: messageData.message,
                date: messageData.date,
                time: messageData.time,
                isRead: messageData.isRead ? 1 : 0,
                isReply: messageData.isReply ? 1 : 0,
                profileImg: messageData.profileImg
            }
        );

        // Handle the replies
        if (messageData.replies && messageData.replies.length > 0) {
            // Delete old replies
            await connection.execute(
                `DELETE FROM replies WHERE message_id = :message_id`,
                { message_id: id }
            );

            // Insert the updated replies
            await Promise.all(
                messageData.replies.map(reply => {
                    return connection.execute(
                        `INSERT INTO replies (message_id, sender, receiver, message, date_sent, time_stamp) 
                         VALUES (:message_id, :sender, :receiver, :message, :date_sent, :time_stamp)`,
                        {
                            message_id: id,
                            sender: reply.sender,
                            receiver: reply.receiver,
                            message: reply.message,
                            date: reply.date,
                            time: reply.time
                        }
                    );
                })
            );
        }

        return result;
    }

    // Delete a message and its replies
    static async delete(id) {
        const connection = await OracleDB.getConnection();
        // First delete replies
        await connection.execute(
            `DELETE FROM replies WHERE message_id = :message_id`,
            { message_id: id }
        );
        // Then delete the message itself
        const result = await connection.execute(
            `DELETE FROM message WHERE message_id = :message_id`,
            { id }
        );
        return result;
    }
}

export default Message;
