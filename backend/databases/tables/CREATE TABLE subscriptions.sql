CREATE TABLE subscriptions (
    subscription_id VARCHAR2(20) PRIMARY KEY,      -- Subscription ID with a prefix of 'subs'
    id NUMBER NOT NULL,                       -- User ID (foreign key to users table, assuming user table exists)
    package_name VARCHAR2(255) NOT NULL,           -- Package name for the subscription
    start_date DATE NOT NULL,                      -- Start date of the subscription
    end_date DATE NOT NULL,                        -- End date of the subscription
    is_active NUMBER(1) DEFAULT 1,                 -- Subscription status (1 = active, 0 = inactive)
    CONSTRAINT fk_panel FOREIGN KEY (id) REFERENCES panel_owners(id)  -- Assuming a 'users' table with column 'id'
);
