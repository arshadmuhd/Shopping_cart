var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
const { extname } = require('path');

var hbs=require("express-handlebars")
var app = express();
var db=require('./config/connection')

var session=require('express-session')

//image adding requiring
var fileUpload= require('express-fileupload')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//engine setup of partials and layout directory
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))  

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//adding image fileupload
app.use(fileUpload())

app.use(session({secret:"Key",cookie:{maxAge:600000}})) //60sec time



//mongodb connection
db.connect((err)=>{
  if(err) console.log(" database connection error" + err);
  else console.log("Database connected successfully")
  
})

app.use('/', usersRouter);
app.use('/admin', adminRouter);

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
