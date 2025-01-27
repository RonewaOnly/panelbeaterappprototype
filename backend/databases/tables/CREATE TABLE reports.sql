CREATE TABLE reports (
    id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, -- Auto-generated unique ID for each report
    customerId NUMBER NOT NULL,                             -- Customer ID
    serviceRequest VARCHAR2(255) NOT NULL,                   -- Service Request description
    requestDate DATE NOT NULL,                               -- Request Date (formatted as date)
    status VARCHAR2(50) NOT NULL,                            -- Status of the report (e.g., "Completed")
    responseTime VARCHAR2(50),                               -- Response Time (e.g., "2 hours")
    satisfactionRating NUMBER(1) CHECK (satisfactionRating BETWEEN 1 AND 5) -- Satisfaction rating from 1 to 5
);
