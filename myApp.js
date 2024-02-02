const express = require('express');
const app = express();
const dns = require('dns');
require('dotenv').config();

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true
  }
})

autoIncrement.initialize(mongoose.connection);

urlSchema.plugin(autoIncrement.plugin, { model: 'Url', field: 'shortUrl' });

const Url = mongoose.model('Url', urlSchema);

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let response = {};

const validUrl = (url) => {
  console.log('URL: ===> ' + url)
  dns.lookup(url, (err) => {
    if (err) {
      console.log(err);
    }
  } )
}

app.post('/api/shorturl', (req, res) => {
  const url  = req.body.url;
  const filter = { original_url: url };
  validUrl(url);
  res.send(response);
});

app.get('/api/shorturl/:shortUrl', (req, res, next) => {
  console.log('Consultando shorturl...');
  next();
});

const findUrl = async (filter) => {
  const doc = await Url.findOneAndUpdate(filter, { original_url: filter.original_url }, {
    new: true,
    upsert: true // Make this update into an upsert
  });

  return doc;
}

module.exports = app;