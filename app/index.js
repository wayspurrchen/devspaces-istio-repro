// Types of requests to make to exercise service tracing:

// 3 identical routes, one can error randomly
// 4-5 levels of functions, period, here
// 3rd level can error randomly

import { entry } from './functionality.js';
import express from 'express';
import fetch from 'node-fetch';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
const APP_NAME = process.env.APP_NAME;
if (!APP_NAME) {
  throw new Error('APP_NAME must be set in environment');
}
let OTHER_APP_HOSTNAMES;
if (process.env.OTHER_APP_HOSTNAMES) {
  OTHER_APP_HOSTNAMES = process.env.OTHER_APP_HOSTNAMES.split(',');
}

const getRandomAppHostname = () => {
  return OTHER_APP_HOSTNAMES[getRandomInt(OTHER_APP_HOSTNAMES.length)];
};


var app = express();

app.set('view engine', 'ejs');

// index page
app.get('/', function (req, res) {
  res.render('../view.ejs');
});


// var params = {
//   parameter1: 'value_1',
//   parameter2: 'value 2',
//   parameter3: 'value&3' 
// };

// var esc = encodeURIComponent;
// var query = Object.keys(params)
//   .map(k => esc(k) + '=' + esc(params[k]))
//   .join('&');

const routes = ['/good', '/bad', '/coinflip'];

const attemptChain = async (url, fail, ...args) => {
  if (OTHER_APP_HOSTNAMES) {
    const route = routes[getRandomInt(2)];
    const otherApp = getRandomAppHostname();
    const url = `http://${otherApp}${route}`
    console.log(`${APP_NAME}: Chaining to ${url}`)
    const response = await fetch(url);
    let responseBody;
    if (response.status === 200) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }

    return responseBody;
  } else {
    return Promise.resolve();
  }
  // var url = new URL(""),
  // params = {lat:35.696233, long:139.570431}
  // Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  // fetch(url).then(...)
};

// Start using devspaces for this workflow
// Create helm chart for app
// TODO NEXT: Get these to send to the server, set up in-cluster requests
// Get set up with docker-compose etc.
// Deploy to GKE.
// Check that it works with istio sidecars, check graph
// Instrument apps and test tracing
app.get('/good', async (_req, res, next) => {
  console.log(`${APP_NAME}: Received request /good`);
  const chainResult = await attemptChain();

  try {
    res.json({ appName: APP_NAME, value: entry(false, APP_NAME, chainResult)});
  } catch (e) {
    next(e);
  }
});
app.get('/bad', async (_req, res, next) => {
  console.log(`${APP_NAME}: Received request to /bad`);
  // no chainResult here because this will always fail

  try {
    res.json({ appName: APP_NAME, value: entry(true, APP_NAME)});
  } catch (e) {
    next(e);
  }
});
app.get('/coinflip', async (_req, res, next) => {
  console.log(`${APP_NAME}: Received request /coinflip`);
  const chainResult = await attemptChain();

  try {
    res.json({ appName: APP_NAME, value: entry(0.333, APP_NAME, chainResult)});
  } catch (e) {
    next(e);
  }
});

app.use((err, _req, res, next) => {
  res.status(500).json({
    appName: APP_NAME,
    value: err.stack.toString()
  })
})

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server is listening on port ${PORT}`);