var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var captHumRouter = require('./routes/capteur_hum');
var mqttHandler = require('./routes/mqttRoute');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(cors());
app.use('/', indexRouter);

app.use('/capt1', captHumRouter);

//app.use('/data', usersRouter);


var mqttClient = new mqttHandler();
mqttClient.connect();


/*app.use("/mqtt", function(req, res) {
  mqttClient.receiveMessage();
  //res.status(200).send("Message sent to mqtt");
});*/

app.use("/test", function(req,res){
  console.log("hello");
  res.send('test');
})


// √©tablissement de la connexion

/*app.use("/node-red",function(req,res){
  console.log('ok node red');
})*/


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
