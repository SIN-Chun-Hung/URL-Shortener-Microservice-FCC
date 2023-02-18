require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const originalUrls = [];
const shortenUrls = [];

app.post('/api/shorturl', bodyParser.urlencoded({ extended: false }), function (req, res) {
  let originalUrl = req.body.url; 
  let existIndex = originalUrls.indexOf(originalUrl); 

  if (!originalUrl.includes('https://') && !originalUrl.includes('http://')) {
  return res.json({error: 'invalid url'});    
  }

  if (existIndex < 0) {
    originalUrls.push(originalUrl); 
    shortenUrls.push(shortenUrls.length);

    return res.json({original_url : originalUrls[originalUrls.length - 1], short_url : shortenUrls.length - 1});  
  }
  
  return res.json({original_url : originalUrls[existIndex], short_url : shortenUrls[existIndex]});
});

app.get('/api/shorturl/:shorturl', function (req, res) {
  let shortenUrl = parseInt(req.params.shorturl);
  let existIndex = shortenUrls.indexOf(shortenUrl); 

  if (existIndex < 0) {
    return res.json({error: 'No such shorten url, please enter another number'});
  }

  res.redirect(originalUrls[existIndex]);
})



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
