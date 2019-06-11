var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var openid= require("openid");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter= require('./routes/authenticate');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret:"hello world",
    resave:false,
    saveUninitialized:false
}));

var relyingParty = new openid.RelyingParty('http://192.168.0.100:3000/vertify', null, false, false, []);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/authenticate',authRouter(relyingParty));
app.use('/vertify',require('./routes/vertify')(relyingParty));

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
