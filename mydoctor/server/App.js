const express = require('express');
require('dotenv').config();
const routes = require('./routes');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models/database');
const models = require('./models');

const port = process.env.PORT || 5000;

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/', routes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});

db.sync().then(() => {
  app.listen(4000, () => {
    console.log('express is running on port ' + port);
  });
});

/*
{
    "name" : "Mohammed Waleed Soliman",
    "email" : "wedo0.hy@gmail.com",
    "password" : "123456",
    "userType" : "doctor",
    "location" : {
        "latitude" : 14.04845,
        "longitude" : 51.15952
    },
    "specialization" : "eye",
    "address" : "Egypt - Portsaid",
    "workingHours" : "5 - 7",
    "phone" : "01224478456"
}
*/