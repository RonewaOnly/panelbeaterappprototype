CREATE TABLE panel_owners (
    id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, -- Auto-incremented primary key
    business_name VARCHAR2(255) NOT NULL,
    owner_name VARCHAR2(255) NOT NULL,
    registration_date DATE NOT NULL,
    email VARCHAR2(255) UNIQUE NOT NULL,
    contact_number VARCHAR2(20),
    username VARCHAR2(255) UNIQUE NOT NULL,
    registration_tax_number VARCHAR2(50),
    password VARCHAR2(255) NOT NULL, -- Store password securely (use encryption in practice)
    registration_doc VARCHAR2(255), -- Document related to registration
    business_logo VARCHAR2(255), -- Path or filename for the business logo
    business_location VARCHAR2(255),
    stuff_number NUMBER,
    business_type VARCHAR2(255), -- Comma-separated list for business types
    business_category VARCHAR2(255), -- Comma-separated list for business categories
    business_sub_category VARCHAR2(255), -- Comma-separated list for business sub-categories
    business_description CLOB, -- Text for business description
    business_website VARCHAR2(255),
    business_social_media VARCHAR2(255),
    business_contact VARCHAR2(20),
    business_email VARCHAR2(255)
);

-- Indexes to improve performance on frequently searched fields
CREATE INDEX idx_email ON panel_owners(email);
CREATE INDEX idx_username ON panel_owners(username);

-- Ensure that email and username are unique
ALTER TABLE panel_owners ADD CONSTRAINT unique_email UNIQUE (email);
ALTER TABLE panel_owners ADD CONSTRAINT unique_username UNIQUE (username);