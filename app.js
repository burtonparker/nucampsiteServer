var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session); // with session, we are immediately calling a function return on our import

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/nucampsite';
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'),
  err => console.log(err)
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321')); // can't use cookieParser AND Express Sessions, conflicts arise!

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false, // when new session is created, but nothing happens, this just dumps that EMPTY session, no cookie will be sent either, helps prevent having tons of empty session files.
  resave: false, // this helps keep a session active, research the documentation
  store: new FileStore() // saves to the server's actual hard disk
}));

// new and returning users need to be able to access the index and users routes, so we're placing them both ABOVE the user authentication code here. welcome users!

app.use('/', indexRouter);
app.use('/users', usersRouter);

// begin user authentication

function auth(req, res, next) {
  console.log(req.session);

  if (!req.session.user) { // removed some code because userRouter now handling some authentication, now all we're doing is just asking "Are you not authenticated?"
      const err = new Error('You are not authenticated!');
      err.status = 401;
      return next(err);

    // RIP to our user/pass split code here, check git history for reference

  } else {
    if (req.session.user === 'authenticated') { // if true, you can go to the next middleware function
        return next();
    } else {
        const err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);      
    }
  }
}

app.use(auth);

// end user authentication

app.use(express.static(path.join(__dirname, 'public')));

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
