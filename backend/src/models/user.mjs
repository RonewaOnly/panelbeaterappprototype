import OracleDB from 'oracledb';
import bcrypt from 'bcrypt';

import { initialize, close } from '../dbConfig.mjs';

class PanelOwner {
    constructor(data = {}) {
        this.businessName = data.businessName || null;
        this.ownerName = data.ownerName || null;
        this.registrationDate = data.registrationDate || null;
        this.email = data.email || null;
        this.contactNumber = data.contactNumber || null;
        this.username = data.username || null;
        this.registrationTaxNumber = data.registrationTaxNumber || null;
        this.password = data.password || null;
        this.registrationDoc = data.registrationDoc || null;
        this.businessLogo = data.businessLogo || null;
        this.businessLocation = data.businessLocation || null;
        this.stuffNumber = data.stuffNumber || null;
        this.businessType = data.businessType || [];
        this.businessCategory = data.businessCategory || [];
        this.businessSubCategory = data.businessSubCategory || [];
        this.businessDescription = data.businessDescription || null;
        this.businessWebsite = data.businessWebsite || null;
        this.businessSocialMedia = data.businessSocialMedia || null;
        this.businessContact = data.businessContact || null;
        this.businessEmail = data.businessEmail || null;
    }

    // Static method to register a new panel owner in the database
    static async registerPanelOwner(panelOwner) {
        let connection;
        try {
            // Get a connection from the pool
            connection = await OracleDB.getConnection();
            // Hash the password (await is required because hashPassword is asynchronous)
            const hashed = await PanelOwner.hashPassword(panelOwner.password);
            // Prepare an SQL query to insert the panel owner data
            const sql = `
                INSERT INTO panel_owners 
                    (business_name, owner_name, registration_date, email, contact_number, username, 
                    registration_tax_number, password, registration_doc, business_logo, business_location, 
                    stuff_number, business_type, business_category, business_sub_category, business_description, 
                    business_website, business_social_media, business_contact, business_email)
                VALUES 
                    (:businessName, :ownerName, :registrationDate, :email, :contactNumber, :username, 
                    :registrationTaxNumber, :password, :registrationDoc, :businessLogo, :businessLocation, 
                    :stuffNumber, :businessType, :businessCategory, :businessSubCategory, :businessDescription, 
                    :businessWebsite, :businessSocialMedia, :businessContact, :businessEmail)
            `;

            // Execute the query with the panel owner data
            await connection.execute(sql, {
                businessName: panelOwner.businessName,
                ownerName: panelOwner.ownerName,
                registrationDate: panelOwner.registrationDate,
                email: panelOwner.email,
                contactNumber: panelOwner.contactNumber,
                username: panelOwner.username,
                registrationTaxNumber: panelOwner.registrationTaxNumber,
                password: hashed,
                registrationDoc: panelOwner.registrationDoc,
                businessLogo: panelOwner.businessLogo,
                businessLocation: panelOwner.businessLocation,
                stuffNumber: panelOwner.stuffNumber,
                businessType: panelOwner.businessType.join(','),  // Assuming this is an array
                businessCategory: panelOwner.businessCategory.join(','),  // Assuming this is an array
                businessSubCategory: panelOwner.businessSubCategory.join(','),  // Assuming this is an array
                businessDescription: panelOwner.businessDescription,
                businessWebsite: panelOwner.businessWebsite,
                businessSocialMedia: panelOwner.businessSocialMedia,
                businessContact: panelOwner.businessContact,
                businessEmail: panelOwner.businessEmail
            });

            // Commit the transaction
            await connection.commit();

            console.log('Panel owner registered successfully!');
        } catch (err) {
            console.error('Error registering panel owner:', err.message);
        } finally {
            // Release the connection back to the pool
            if (connection) {
                await connection.close();
            }
        }
    }

    // Static method to fetch a panel owner by email
    static async getPanelOwnerByEmail(email) {
        let connection;
        try {
            // Get a connection from the pool
            connection = await OracleDB.getConnection();

            // Prepare an SQL query to fetch the panel owner by email
            const sql = `
                SELECT * FROM panel_owners WHERE email = :email
            `;

            // Execute the query
            const result = await connection.execute(sql, { email });

            // Return the panel owner data
            return result.rows[0];  // Assuming the result contains the row data
        } catch (err) {
            console.error('Error fetching panel owner by email:', err.message);
        } finally {
            // Release the connection back to the pool
            if (connection) {
                await connection.close();
            }
        }
    }

    // Static method to fetch a panel owner by email and password
    static async getPanelOwnerByEmailAndPassword(email, password) {
        let connection;
        try {
            // Get a connection from the pool
            connection = await OracleDB.getConnection();

            // Prepare an SQL query to fetch the panel owner by email and password
            const sql = `
                SELECT * FROM panel_owners WHERE email = :email AND password = :password
            `;

            // Execute the query
            const result = await connection.execute(sql, { email, password });

            // Return the panel owner data
            return result.rows[0];  // Assuming the result contains the row data
        } catch (err) {
            console.error('Error fetching panel owner by email and password:', err.message);
        } finally {
            // Release the connection back to the pool
            if (connection) {
                await connection.close();
            }
        }
    }

    // Method to validate password (e.g., check if it's at least 8 characters long)
    static validatePassword(password) {
        const minLength = 8;
        if (password.length < minLength) {
            return `Password must be at least ${minLength} characters long.`;
        }
        return true;
    }

    //a function to work on static functions to hash the password
    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
    //a function to work on static functions to compare  the hashed password with the password
    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

export default PanelOwner;
