const functions = require('firebase-functions');
const got = require('got');
const cors = require('cors');
const express = require('express');

const allowedOrigins = [
  'https://whatdoyousuggest.net',
  'http://localhost:8080'
];
const app = express();

app.use(
  cors({
    origin: (origin, cb) => {
      return allowedOrigins.indexOf(origin) > -1
        ? cb(null, true)
        : cb(new Error('CORS Error'));
    }
  })
);

app.get('/', (req, res) => {
  got('http://google.com/complete/search', {
    json: true,
    query: { client: 'chrome', q: req.query.q }
  })
    .then(res => {
      return res.body[1].filter((d, i) => {
        return res.body[4]['google:suggesttype'][i] === 'QUERY';
      });
    })
    .then(out => res.send(JSON.stringify(out)))
    .catch(err => {
      throw err;
    });
});

exports.suggestions = functions.https.onRequest(app);
