const config = require('./configurations/config');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var employeeRouter = require('./routes/employee')
var departmentsRouter = require('./routes/departments')
var designationsRouter = require('./routes/designations')

var app = express();

const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore(config.db);

app.use(session({
	key: 'session_cookie_name',
	secret: 'session_cookie_secret',
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));


// app.use(session({
//   secret: config.sessionSecret,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { maxAge: 24 * 60 * 60 * 1000 }
// }))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/employees', employeeRouter);
app.use('/departments', departmentsRouter);
app.use('/designations', designationsRouter);
app.use('/users', usersRouter);

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
