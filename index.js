require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const myApp = require('./myApp');
const bodyParser = require('body-parser');
let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

// Tracking
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
})

//App
app.use('/', myApp);

// Basic Configuration
const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
