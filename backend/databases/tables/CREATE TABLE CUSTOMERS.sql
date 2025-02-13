CREATE TABLE CUSTOMERS(
    CUSTOMER_ID INT PRIMARY KEY ,
    CUSTOMER_NAME VARCHAR(255) NOT NULL,
    CUSTOMER_ADDRESS VARCHAR(255) NOT NULL,
    CUSTOMER_PHONE VARCHAR(255) NOT NULL,
    CAR_MODEL VARCHAR(255) NOT NULL,
    CAR_YEAR INT NOT NULL,
    CAR_COLOR VARCHAR(255),
    CAR_PROBLEM_DESCRIPTION VARCHAR(255) NOT NULL,
    CAR_REPAIR_STATUS VARCHAR(255)  DEFAULT 'NOT VIEWED' NOT NULL 
);
--when working with default values, it is important to note that the default value is only applied to new rows that are added to the table. It does not affect existing rows. And also that the 'Not Null' must be after the default value