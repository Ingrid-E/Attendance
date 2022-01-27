var createError = require('http-errors');
var express = require('express');
const path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var indexRouter = require('./routes/index');
var coursesRouter = require('./routes/courses');
var studentsRouter = require('./routes/students');
var professorsRouter = require('./routes/professors');
var campusesRouter = require('./routes/campuses');
var staffRouter = require('./routes/staff')
var assistanceRouter = require('./routes/assistance')
var adminRouter = require('./routes/administrators')
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/courses', coursesRouter)
app.use('/students', studentsRouter)
app.use('/users', usersRouter);
app.use('/staff', staffRouter);
app.use('/admin', adminRouter);
app.use('/assistance', assistanceRouter);
app.use('/campuses', campusesRouter);
app.use('/professors', professorsRouter);

//
app.use(express.static(path.join(__dirname, "client/build")))

if(process.env.NODE_ENV === "production"){
  //server static content
  app.use(express.static(path.join(__dirname, "client/build")))
}




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
