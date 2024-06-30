BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS "users" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "role" TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS "tickets" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "timestamp" DATE NOT NULL,
    "description" TEXT NOT NULL,
    FOREIGN KEY(ownerId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS "answers" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "ticketId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "timestamp" DATE NOT NULL,
    FOREIGN KEY(ticketId) REFERENCES tickets(id),
    FOREIGN KEY(authorId) REFERENCES users(id)
);

-- Populating the user table
INSERT INTO "users" ("username", "role", "hashedPassword", "salt") VALUES ('Narciso', 'admin', 'f263f6922ccf14bd24ad799c687464a172f79ffb2cc5bc9453f6561a006e9bcc', '9c4ad8f30a51763bc3f5574863be9a5f');
INSERT INTO "users" ("username", "role", "hashedPassword", "salt") VALUES ('Andrea', 'basic', '3fb4908daecb9838d783a36fb142cac741de6a0ca32343627ba5ec8242f3836b', 'e186ca6aa98efa7f287c0b55a5b8323e');
INSERT INTO "users" ("username", "role", "hashedPassword", "salt") VALUES ('Ermes', 'basic', 'd35fc1316eb25f12f8a82b47701bc6c1f99a2b044ed8a3033d810c3517b4b085', '48aa582fee533b01ba6eb09c15a6d1b0'); 
INSERT INTO "users" ("username", "role", "hashedPassword", "salt") VALUES ('Dagale', 'basic', '2f9693e3cd4be2215767bc948f21b9fd82e963b65415db24612a990e19394744', '60ff98aaa57033b6b4ce71c7b8cfb64a');
INSERT INTO "users" ("username", "role", "hashedPassword", "salt") VALUES ('TheHero', 'basic', '2d5e75ecc0493e81368025da5a1d767d83fe14b4c8becb5f1527e6458996ad9d', '589bccf8a0181309fd18634aa85f7a8b');
INSERT INTO "users" ("username", "role", "hashedPassword", "salt") VALUES ('Enrico', 'admin', 'b946e4bad5cb86e787db2d533908f25a19b50f87f8419d5b37fabcf14536cb71', 'fa56c8ceb4277143afaa1c1986c27876');
INSERT INTO "users" ("username", "role", "hashedPassword", "salt") VALUES ('Ire', 'basic', 'e986c6fa22f5f8c189f1403d0d4cda8835bca5f82b3672bf999f626df37c3266', '32ad5352b070e1940cb4162b35cef8b1');


-- Populating the ticket table
INSERT INTO "tickets" ("title", "state", "category", "ownerId", "timestamp", "description") 
VALUES ('Inquiry about product', 'open', 'inquiry', 1, '2024-06-12 10:00:00', 'I have a question about the product features.');
INSERT INTO "tickets" ("title", "state", "category", "ownerId", "timestamp", "description") 
VALUES ('Maintenance request', 'open', 'maintenance', 7, '2024-06-12 11:00:00', 'The system needs maintenance due to a bug.');
INSERT INTO "tickets" ("title", "state", "category", "ownerId", "timestamp", "description") 
VALUES ('New feature suggestion', 'closed', 'new feature', 1, '2024-06-12 12:00:00', 'I suggest adding a dark mode to the application.');
INSERT INTO "tickets" ("title", "state", "category", "ownerId", "timestamp", "description") 
VALUES ('Payment issue', 'open', 'payment', 3, '2024-06-12 13:00:00', 'I encountered an issue while processing the payment.');
INSERT INTO "tickets" ("title", "state", "category", "ownerId", "timestamp", "description") 
VALUES ('Administrative help needed', 'closed', 'administrative', 3, '2024-06-12 14:00:00', 'I need help with administrative tasks.');
INSERT INTO "tickets" ("title", "state", "category", "ownerId", "timestamp", "description") 
VALUES ('Inquiry about new feature', 'open', 'inquiry', 5, '2024-06-12 15:00:00', 'Is there any plan to introduce new features soon?');
INSERT INTO "tickets" ("title", "state", "category", "ownerId", "timestamp", "description") 
VALUES ('Request for system upgrade', 'open', 'maintenance', 6, '2024-06-12 16:00:00', 'We need an upgrade to the latest version.');
INSERT INTO "tickets" ("title", "state", "category", "ownerId", "timestamp", "description") 
VALUES ('New feature: user roles', 'closed', 'new feature', 7, '2024-06-12 17:00:00', 'I suggest adding different user roles.');

-- Populating the answer table
INSERT INTO "answers" ("ticketId", "content", "authorId", "timestamp") 
VALUES (1, 'Can you provide more details about your inquiry?', 2, '2024-06-12 10:05:00');
INSERT INTO "answers" ("ticketId", "content", "authorId", "timestamp") 
VALUES (1, 'Sure.
I would like to know if the product supports multiple languages.', 1, '2024-06-12 10:10:00');
INSERT INTO "answers" ("ticketId", "content", "authorId", "timestamp") 
VALUES (1, 'Yes. 
It supports multiple languages.', 2, '2024-06-12 10:15:00');
INSERT INTO "answers" ("ticketId", "content", "authorId", "timestamp") 
VALUES (2, 'The bug causes the application to crash occasionally.', 2, '2024-06-12 11:05:00');
INSERT INTO "answers" ("ticketId", "content", "authorId", "timestamp") 
VALUES (3, 'Thank you for the suggestion. We will consider it in future updates.', 3, '2024-06-12 12:05:00');
INSERT INTO "answers" ("ticketId", "content", "authorId", "timestamp") 
VALUES (4, 'Please provide the payment details you used.', 3, '2024-06-12 13:05:00');
INSERT INTO "answers" ("ticketId", "content", "authorId", "timestamp") 
VALUES (4, 'I used a Visa card ending in 1234.
Can you help me?', 1, '2024-06-12 13:10:00');
INSERT INTO "answers" ("ticketId", "content", "authorId", "timestamp") 
VALUES (4, 'We solved the problem', 3, '2024-06-12 13:15:00');
INSERT INTO "answers" ("ticketId", "content", "authorId", "timestamp") 
VALUES (5, 'Administrative tasks are now handled by our new department.', 4, '2024-06-12 14:05:00');
INSERT INTO "answers" ("ticketId", "content", "authorId", "timestamp") 
VALUES (6, 'We are planning to introduce new features in Q3. 
Stay tune.', 5, '2024-06-12 15:05:00');
INSERT INTO "answers" ("ticketId", "content", "authorId", "timestamp") 
VALUES (7, 'The upgrade will include performance improvements.', 6, '2024-06-12 16:05:00');

COMMIT;