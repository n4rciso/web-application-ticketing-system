'use strict';

const db = require('./db');

/*  
 *  This function is internally used to convert a ticket object from the database 
 *  record format to the API format.
 */
const convertTicketFromDbRecord = (dbRecord) => {
  const ticket = {};
  ticket.id = dbRecord.id;
  ticket.title = dbRecord.title;
  ticket.state = dbRecord.state;
  ticket.category = dbRecord.category;
  ticket.ownerId = dbRecord.ownerId;
  ticket.timestamp = dbRecord.timestamp;
  ticket.description = dbRecord.description;
  return ticket;
}

/*
 *  This function retrieves the mainly information of a specific ticket (that 
 *  all user, authenticated or not, can se from the database). So, description 
 *  and answer blocks are not included in the response.
 *  The ticket is returned as a JSON object.
 */
exports.getTicket = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM tickets t WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve({ error: 'Ticket not found.' });
      } else {
        const ticket = convertTicketFromDbRecord(row);
        resolve(ticket);
      }
    });
  });
};


/*
 *  This function is similar to the previous one, however, I preferred to use 
 *  two different functions. An alternative could have been to have only `listTickets`
 *  and select the individual ticket object using the ID as an index.
 *  Note: this function also provides the username of the ticket owner.
 */
exports.listTickets = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT t.id,t.title,t.state,t.category,t.ownerId,t.timestamp,
            u.username AS owner FROM tickets t JOIN users u ON t.ownerId = u.id`;
    db.all(sql, (err, rows) => {
      if (err) { 
        reject(err); 
      }
      const ticekts = rows.map((e) => {
        const ticket = convertTicketFromDbRecord(e);
        ticket.owner = e.owner;// adding owner name
        return ticket;
      });
      resolve(ticekts);
    });
  });
};

/* This function retrieves the description and the answer (generally blocks) of 
 * a specified ticket. The description and answers blocks are caracterized by 
 * the content, the author and the timestamp.
 */
exports.getTicketBlocks = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
    SELECT t.description AS content, u.username AS author, t.timestamp 
    FROM tickets t 
    JOIN users u ON t.ownerId = u.id 
    WHERE t.id = ? 
    UNION ALL 
    SELECT a.content, u.username AS author, a.timestamp 
    FROM answers a 
    JOIN users u ON a.authorId = u.id 
    WHERE a.ticketId = ? 
    ORDER BY timestamp
    `;
    db.all(sql, [id, id], (err, rows) => {
      if (err) {
        reject(err);
      } else if (rows.length === 0) {
        resolve({ error: 'Ticket not found.' });
      } else {
        const ticketsBlocks = rows.map(row => ({
          content: row.content,
          author: row.author,
          timestamp: row.timestamp
        }));
        resolve(ticketsBlocks);
      }
    });
  });
};


/**
 * This function adds a new ticket in the database.
 * The ticket is returned as this.lastID.
 */
exports.createTicket = (ticket) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO tickets (title, state, category, ownerId, timestamp, description) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(sql, [ticket.title, ticket.state, ticket.category, ticket.ownerId, ticket.timestamp, ticket.description], function (err) {
      if (err) {
        reject(err);
      } else {
        // Returning the newly created object with the DB additional properties (i.e., unique id) to the client.
        resolve(exports.getTicket(this.lastID));
      }
    });
  });
};


/**
 * This allow to update a ticket in the database.
 */
exports.updateTicket = (id, ticket) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE tickets SET title = ?, state = ?, category = ?, ownerId = ?, timestamp = ?, description = ? WHERE id = ?';
    db.run(sql, [ticket.title, ticket.state, ticket.category, ticket.ownerId, ticket.timestamp, ticket.description, id], function (err) {
      if (err) {
        reject(err);
      }
      if (this.changes !== 1) {
        resolve({ error: 'Ticket not found.' });
      } else {
        resolve(exports.getTicket(id));
      }
    });
  });
};


/**
 * This function allow user to answer a ticket
 */
exports.answerATicket = (authorId, ticketId, answer) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO answers (ticketId, content, authorId, timestamp) VALUES (?, ?, ?, ?)';
    db.run(sql, [ticketId, answer.content, authorId, answer.timestamp], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(exports.getTicketBlocks(ticketId)); // Returning all the blocks of the ticket.
      }
    });
  });
};
