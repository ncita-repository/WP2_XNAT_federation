// server.js to serve xfa cognito auth testing app

// requirements
const express = require('express');
const dotEnv = require('dotenv');
const axios = require('axios');
const qs = require('qs');
const base64url = require('base64url');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const { v4: uuid } = require('uuid');

// keys for JWT verification
// FIND AND STORE IN jwks.json
const jwks = require('./jwks.json');

// load .env file if not in production
if (process.env.NODE_ENV !== 'production') {
  dotEnv.config();
}

// instance of express
const app = express();

// app settings
app.set('trust proxy', true); // trust the reverse proxy
app.set('view engine', 'pug');

// middleware
// serve static files
app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));

// session, with unique id generation
app.use(session({
  genid: (req) => {
    return uuid() // session IDs
  },
  // change store and secret in prod.
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// routes
// pass Cognito login url to index page
app.get('/', (req, res) => {

  // state parameter per session
  const stateParam = crypto.randomBytes(10).toString('hex');
  req.session.state = stateParam;

  // make URL
  const urlLogin = new URL(`${process.env.AUTH_DOMAIN}/oauth2/authorize`);
  urlLogin.searchParams.append('response_type', 'code');
  urlLogin.searchParams.append('client_id', `${process.env.CLIENT_ID}`);
  urlLogin.searchParams.append('redirect_uri', 'https://localhost/auth-callback');
  urlLogin.searchParams.append('state', stateParam);
  urlLogin.searchParams.append('scope', 'openid email profile');
  console.log(urlLogin);

  res.render('index', { url: urlLogin });
})

// route once user has authenticated - get returned code
app.get('/auth-callback', (req, res) => {

  // get the parameters out from the querystring
  const qryStr = new URL(`https://localhost${req.url}`).searchParams;
  const code = qryStr.get('code');
  const state = qryStr.get('state');

  // check state
  if (req.session.state == state) {

    const basicAuth = base64url(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);

    // function to call Cognito token endpoint
    const getTokens = async () => {
      try {
        return await axios({
          method: 'post',
          url: `${process.env.AUTH_DOMAIN}/oauth2/token`,
          data: qs.stringify({
            grant_type: 'authorization_code',
            redirect_uri: 'https://localhost/auth-callback',
            code: code
          }),
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'authorization': `Basic ${basicAuth}`
          }
        })
      } catch (error) {
        console.log(error);
      }
    }

    // wait for tokens then validate, and store
    const storeTokens = async () => {
      const tokens = await getTokens();

      // decode id and access tokens
      const decodedIdToken = jwt.decode(tokens.data.id_token, {complete: true});
      const decodedAcToken = jwt.decode(tokens.data.access_token, {complete: true});

      // identify the key used for ID token
      let jwkId = [];
      if (decodedIdToken.header.kid == jwks.keys[0].kid) {
        jwkId = jwks.keys[0];
      } else {
        jwkId = jwks.keys[1];
      }

      // identify the key used for access token
      let jwkAc = [];
      if (decodedAcToken.header.kid == jwks.keys[0].kid) {
        jwkAc = jwks.keys[0];
      } else {
        jwkAc = jwks.keys[1];
      }

      // convert to pem for verification
      const pemId = jwkToPem(jwkId);
      const pemAc = jwkToPem(jwkAc);

      // verify the token in synchronous fashion
      const verifiedIdToken = jwt.verify(tokens.data.id_token, pemId, { algorithms: ['RS256'] });
      const verifiedAcToken = jwt.verify(tokens.data.access_token, pemAc, { algorithms: ['RS256'] });
      console.log(verifiedIdToken);
      console.log(verifiedAcToken);

      // then need to verify the claims...

      // store tokens in session
      req.session.tokens = tokens.data;

      // send user attributes to the dashboard page
      res.render('dashboard', { username: verifiedAcToken.username, email: verifiedIdToken.email });

    }

    // get and validate tokens, then store in session
    storeTokens()

  } else {
    res.redirect('/');
  }
})

// listen on PORT
app.listen(process.env.PORT, () => {
  console.log(`OpenID app listening at https://localhost via reverse proxy`);
})
