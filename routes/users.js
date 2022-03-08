const express = require('express');
const User = require('../models/user');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => { // after path arguments, give our middleware functions
    User.findOne({username: req.body.username}) // is the username already taken?
    .then(user => {
      if (user) {
        const err = new Error(`User ${req.body.username} already exists!`);
        err.status = 403;
        return next(err);
      } else {
        User.create({ // notice we're not setting the admin field here, we use the prior false default value so that way a new user can't turn themselves into an admin.
          username: req.body.username,
          password: req.body.password
        })
        .then(user => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({status: 'Registration Successful!', user: user}); // pass along a representation of the user document (aka database)
        })
        .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});

router.post('/login', (req, res, next) => { // is the user already logged in?
    if (!req.session.user) {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        const err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
      }

      const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const username = auth[0]; // username to match schema
      const password = auth[1]; // password to match schema

      User.findOne({username: username}) // authenticate if the user already exists in the database
      .then(user => {
          if (!user) {
            const err = new Error(`User ${username} does not exist`);
            err.status = 401;
            return next(err);
          } else if (user.password !== password) {
            const err = new Error('Your password is incorrect!');
            err.status = 401;
            return next(err);
          } else if (user.username === username && user.password === password) {
            req.session.user = 'authenticated';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You are authenticated!');
          }
      })
      .catch(err => next(err));
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already authenticated!');
    }
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy(); // destroy the session on the server side, no longer valid if user tries to use the session id. sorry, you've been DESTROYED
    res.clearCookie('session-id');
    res.redirect('/'); // redirect the user back to the homepage effectively
  } else { // what if no session exists, but they are trying to logout anyway?
    const err = new Error('You are not logged in!');
    err.status = 401;
    return next(err);
  }
});

module.exports = router;
