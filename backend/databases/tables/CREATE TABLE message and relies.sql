CREATE TABLE message (
    message_id VARCHAR2(255) PRIMARY KEY,
    sender VARCHAR2(255),
    receiver VARCHAR2(255),
    message CLOB,
    date_sent DATE,
    time_stamp VARCHAR2(20),
    isRead NUMBER(1) DEFAULT 0, -- 0 for false, 1 for true
    isReply NUMBER(1) DEFAULT 0, -- 0 for false, 1 for true
    profileImg VARCHAR2(255)
);

CREATE TABLE replies (
    replies_id NUMBER PRIMARY KEY ,
    message_id VARCHAR2(255),
    sender VARCHAR2(255),
    receiver VARCHAR2(255),
    message CLOB,
    date_sent DATE,
    time_stamp VARCHAR2(20),
    FOREIGN KEY (message_id) REFERENCES Message(message_id)
);
