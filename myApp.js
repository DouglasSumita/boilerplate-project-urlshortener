const express = require('express');
const app = express();
const dns = require('dns');
const urlList = [];

app.use('/public', express.static( __dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

const checkUrl = (req, res, next) => {
  const { url } = req.body;
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch(err) {
    res.send({ "error": 'Invalid URL' });
    return;
  }
  dns.lookup(hostname, (err) => {
    if (err) {
      res.send({ "error": 'Invalid URL' });
      return;
    }
    next();
  })
}

app.post('/api/shorturl', checkUrl, (req, res) => {
  const { url } = req.body;
  let urlObj = urlList.filter(({ original_url }) => original_url === url);
  if (urlObj.length === 0) {
    urlList.push({
      original_url: url,
      short_url: urlList.length + 1
    })
    urlObj = urlList[urlList.length - 1];
  }
  res.send(urlObj);
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = parseInt(req.params['shortUrl']);
  const urlSelected = urlList.filter(({ short_url }) => short_url === shortUrl);
  if (urlSelected.length > 0) {
    res.redirect(301, urlSelected[0].original_url);
  }
});

module.exports = app;