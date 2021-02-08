const got = require('got');

exports.handler = async ({ queryStringParameters }, context) => {
  const results = await got('http://google.com/complete/search', {
    json: true,
    // TODO: Maybe whitelist the query params here
    query: Object.assign({ client: 'chrome' }, queryStringParameters)
  }).then(res => {
    return res.body[1].filter((d, i) => {
      return res.body[4]['google:suggesttype'][i] === 'QUERY';
    });
  });

  return {
    statusCode: 200,
    headers: {
      // Netlify, doesn't currently use query strings in the cache key: https://community.netlify.com/t/netlify-function-with-query-strings-ignores-custom-cache-control-header/15390/20
      // 'Cache-Control': 'public, max-age=604800, s-maxage=604800',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(results)
  };
  
}