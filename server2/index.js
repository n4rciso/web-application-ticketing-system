'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { body, validationResult } = require("express-validator");

const { expressjwt: jwt } = require('express-jwt');
const jwtSecret = '82eKgCw2bxTMCKbqhKzIIe1MdPs9QfiMdWx5xhi39beEaV82u8RNal9JaEeCdWUX';

//This is used to create the token
const jsonwebtoken = require('jsonwebtoken');


//FOR DEBUGGING ONLY:to do test with API.http
/*const expireTime = 10; //seconds
const token_admin = jsonwebtoken.sign( { access: 'admin', authId: 1 }, jwtSecret, {expiresIn: expireTime});
const token_basic = jsonwebtoken.sign( { access: 'basic', authId: 2 }, jwtSecret, {expiresIn: expireTime});
console.log(token_admin,token_basic);
*/

// init express
const app = express();
const port = 3002;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

// Check token validity
app.use(jwt({
  secret: jwtSecret,
  algorithms: ["HS256"],
})
);


// To return a better object in case of errors
app.use( function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ errors: [{  'param': 'Server', 'msg': 'Authorization error', 'path': err.code }] });
  } else {
    next();
  }
} );


/*** APIs ***/

app.post('/api/ticket/estimation', 
  body('title', 'Invalid title').isString(),
  body('category', 'Invalid category').isString(),
  (req, res) => {
    // Check if validation is ok
    const err = validationResult(req);
    const errList = [];
    if (!err.isEmpty()) {
      errList.push(...err.errors.map(e => e.msg));
      return res.status(400).json({errors: errList});
    }

    // Calcolo della stima del tempo
    const { title, category } = req.body;
    const totalChars = (title.replace(/\s+/g, '') + category.replace(/\s+/g, '')).length; // Rimuove gli spazi e calcola la lunghezza totale
    const estimationHours = (totalChars * 10) + parseInt(Math.round(Math.random() * 239 +1));

    // Verifica del livello di accesso dell'utente
    const authLevel = req.auth.access;
    if (authLevel === 'admin') {
      res.json({ estimation: estimationHours }); // Stima in ore per gli amministratori
    } else {
      const estimationDays = parseInt(Math.round(estimationHours / 24)); // Stima in giorni per gli utenti normali
      res.json({ estimation: estimationDays });
    }
});


// Activate the server
app.listen(port, () => {
  console.log(`qa-server listening at http://localhost:${port}`);
});
