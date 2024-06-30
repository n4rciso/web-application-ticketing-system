/*
  Note that to facilitate the evaluation of the server I developed a simple API.http that 
  can be used to test the API. I try to test all the possible situations in order to verify 
  that the server behaves correctly.
  */
'use strict';

/*** Importing modules ***/
const express = require('express');
const morgan = require('morgan');                                 
const { check, validationResult} = require('express-validator');
const cors = require('cors');
const crypto = require('crypto'); // Used to generate a strong secret key 
const dayjs = require("dayjs");

const jsonwebtoken = require('jsonwebtoken');
const jwtSecret = '82eKgCw2bxTMCKbqhKzIIe1MdPs9QfiMdWx5xhi39beEaV82u8RNal9JaEeCdWUX';
const expireTime = 10;

const userDao = require('./dao-users'); // module for accessing the user table in the DB
const ticketDao = require('./dao-tickets'); // module for accessing the user table in the DB

/*** init express and set-up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());
const now = dayjs();

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));


/*** Passport ***/

/** Authentication-related imports **/
const passport = require('passport');                              // authentication middleware
const LocalStrategy = require('passport-local');                   // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUser (i.e., id, username, name).
 **/
passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await userDao.getUser(username, password)
  if(!user)
    return callback(null, false, 'Incorrect username or password');  
    
  return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUser, i.e, id, username, name)
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name 
  callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name 
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));

  return callback(null, user); // this will be available in req.user
});


/** Creating the session */
const session = require('express-session');

const secret = crypto.randomBytes(64).toString('hex');
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: app.get('env') === 'production' ? true : false },
}));


app.use(passport.authenticate('session'));


/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}


/*** Utility Functions ***/

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param}) => {
  return `${location}[${param}]: ${msg}`;
};


/*** Tickets APIs ***/


/**
 *  1. Retrieve the generic information (no blocks) of the list of all the available tickets.
 *   - available for all users, authenticated or not
 *   - no validation is required (no parameters are passed)
 *   - GET /api/tickets
 */   
app.get('/api/tickets',
  (req, res) => {
    ticketDao.listTickets()
      .then(tickets => res.json(tickets))
      .catch((err) => res.status(500).json(err));
  }
);


/**
 *  2. Retrieve all the blocks of one specific ticket.
 *   - available only for logged user 
 *   - validation is required
 *   - GET /api/tickets/<id>
 */   
app.get('/api/tickets/:id', isLoggedIn,
  // check if the id is a positive integer
  [ check('id').isInt({min: 1}) ],    
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors );
    }
    try {
      const result = await ticketDao.getTicketBlocks(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);


/**
 * 3. Create a new ticekts, by providing all relevant information
  *   - available only for logged user
  *   - validation is required
  *   - some value are directly inserted in this function and not passed by the client
  *        a. the (ticket) id is automatically generated
  *        b. the timestamp is set to the current time
  *        c. the user id is taken from the session
  *        d. the state is set to 'open'
  *   - POST /api/tickets
*/ 
app.post('/api/tickets', isLoggedIn,
  [ check('title').isString().notEmpty().withMessage('Title must be a non-empty string'),
    check('description').isString().notEmpty().withMessage('Description must be a non-empty string'),
    check('category').isIn(['inquiry', 'maintenance', 'new feature', 'administrative', 'payment']),],

  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors ); 
    }
    const ticket = {
      title: req.body.title,
      state: "open", // default state
      category: req.body.category,
      ownerId: req.user.id, // req.user is set by passport
      timestamp: now.format('YYYY-MM-DD HH:mm:ss'), // format the timestamp
      description: req.body.description
    };

    try {
      const result = await ticketDao.createTicket(ticket);
      res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Error during the creation of the ticket: ${err}` }); 
    }
    
  }
);


/**
 * 4. Update an existing tickets category
 *   - available only for admin users
 *   - validation is required
 *   - PUT /api/tickets/<id>/category
 */
app.put('/api/tickets/:id/category', isLoggedIn,
  [ check('id').isInt({min: 1}),
    check('category').isIn(['inquiry', 'maintenance', 'new feature', 'administrative', 'payment']),],
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors ); 
    }
    if(req.user.role !== 'admin') {
      return res.status(401).json({ error: 'Not authorized (only admin)' });
    }

    const ticketId = Number(req.params.id);
    try {
      const ticket = await ticketDao.getTicket(ticketId);
      if (ticket.error)
        return res.status(404).json(ticket);
      ticket.category = req.body.category;
      console.log(ticket)
      const result = await ticketDao.updateTicket(ticket.id, ticket);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result); 
    } catch (err) {
      res.status(503).json({ error: `Database error during the update of the category of ticket: ${req.params.id}` });
    }
  }
);

/**
 * 5. Update an existing tickets state
 *   - available only for the owner of the ticket or admin users
 *   - validation is required
 *   - PUT /api/tickets/<id>/state
 */
app.put('/api/tickets/:id/state', isLoggedIn,
  [ check('id').isInt({min: 1}),
    check('state').isIn(['open', 'closed']),],
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors );
    }

    const ticketId = Number(req.params.id);
    try {
      const ticket = await ticketDao.getTicket(ticketId);
      console.log(ticket.state, req.user.id !== ticket.ownerId && ticket.state !== 'open')
      if (ticket.error)
        return res.status(404).json(ticket);
      if(req.user.role !== 'admin') {
        if(req.user.id !== ticket.ownerId || ticket.state !== 'open')
        return res.status(401).json({ error: 'Not authorized' });
      }
      ticket.state = req.body.state;
      const result = await ticketDao.updateTicket(ticket.id, ticket);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result); 
    } catch (err) {
      res.status(503).json({ error: `Database error during the update of the state of ticket: ${req.params.id}` });
    }
  }
);


/**
 * 6. Create a new answer (block) to a ticket
 *   - available only for all authenticated users
 *   - validation is required
 *   - some value are directly inserted in this function and not passed by the client
 *       a. the timestamp is set to the current time
 *       b. the author id is taken from the session
 *   - make sure that the ticket is open before answering
 *   - POST /api/tickets/<id>/answer
 */
app.post('/api/tickets/:id/answer', isLoggedIn,
  [
    check('content').isString().notEmpty().withMessage('Content must be a non-empty string'),
    check('id').isInt({min: 1}),
  ],
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors );
    }
    const ticketId = Number(req.params.id);
    const answer = {
      content: req.body.content,
      //authorId: req.user.id,
      timestamp: now.format('YYYY-MM-DD HH:mm:ss'),
    };
    try {

      const ticket = await ticketDao.getTicket(ticketId);
      if (ticket.error)
        return res.status(404).json(ticket);
      if(ticket.state !== 'open') {
        return res.status(422).json({ error: 'Not is possible to answer to a closed ticket' });
      }

      const result = await ticketDao.answerATicket(req.user.id, ticketId, answer);
      res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the creation of new ticket: ${err}` }); 
    }
  }
);



/*** Users APIs ***/

// POST /api/sessions 
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => { 
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json({ error: info});
      }
      // success, perform the login and extablish a login session
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser() in LocalStratecy Verify Fn
        return res.json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});


/*** Token ***/
// GET /api/auth-token
app.get('/api/auth-token', isLoggedIn, (req, res) => {
  let authLevel = req.user.role;
  let authId= req.user.id;

  const payloadToSign = { access: authLevel, authId: authId };
  const jwtToken = jsonwebtoken.sign(payloadToSign, jwtSecret, {expiresIn: expireTime});

  res.json({token: jwtToken, authLevel: authLevel});
});



const port = 3001;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
