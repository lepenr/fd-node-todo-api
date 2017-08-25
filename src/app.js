// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const  mongoose = require('mongoose');


// configs
const configs = require('./configs');
const port = process.env.PORT || configs.general.PORT || 3001;
mongoose.Promise = global.Promise;

// ExpressJs Setup
const app = express();
app.use(bodyParser.json());

//import main router
const routes = require('./routes'); 

app.use(routes);


// start connection with mongodb
mongoose.connect(configs.mongodb.HOST,{
  useMongoClient: true,
});


// Starting up the server
app.listen(port,  function() {
  console.log(`Express server listening on port ${port}`);
});

module.exports = app; 