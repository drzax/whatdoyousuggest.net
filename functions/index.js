const functions = require('firebase-functions');
const got = require('got');
const cors = require('cors');
const express = require('express');

const allowedOrigins = [
  'https://whatdoyousuggest.net',
  'http://whatdoyousuggest.net',
  'http://localhost:8080',
  'https://laughing-euclid-388e47.netlify.com'
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
  res.set('Cache-Control', 'public, max-age=604800, s-maxage=604800');

  got('http://google.com/complete/search', {
    json: true,
    // TODO: Maybe whitelist the query params here
    query: Object.assign({ client: 'chrome' }, req.query)
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
