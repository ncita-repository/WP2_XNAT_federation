// server.js
console.log('XNAT federation app is go!');

// initial requirements
const express = require('express');
const passport = require('passport');
const axios = require('axios');
const Strategy = require('passport-local').Strategy;
const db = require('./db');

// Now configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Create a new Express application.
const app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

// Use middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false ,
  name: 'sessionid',
  cookie: { maxAge: 15000 }
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes:
//
// home page get
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

// login page get
app.get('/login',
  function(req, res){
    res.render('login');
  });

// after user posts login details
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

// if user logs out
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

// user profile page
app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

// display xnat instances page
app.get('/xnats',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){

    // get the urls of the available xnats to send with the page
    let user = req.user;
    let xnats = [];
    user.xnats.forEach((element, idx) => {
      xnats[idx] = db.xnats.findXnat(element.id);
    });

    res.render('xnats', { user: req.user, xnats: xnats});
  });

  // redirect to a chosen XNAT
app.post('/xnats',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){

    // get user and xnat ID
    const userID = req.user.id;
    const xnatID = req.body.xnatID;

    // determine the XNAT to go to
    const chosenXnat = db.xnats.findXnat(xnatID);
    console.log(chosenXnat);

    // get user credentials for the requests
    const userCred = db.userXnats.findUserXnat(userID, xnatID);
    console.log(userCred);

    // REQUESTS TO XNAT: *******************************************************
    // comment out as appropriate...

    // from the xnat-scaffold, a GET to /data/auth
    // returns a message "user so-and-so is now logged in",
    // and they do have a JSESSIONID
/*
    axios({
      method: 'get',
      url: `${chosenXnat.url}/data/auth`,
      auth: {
        username: userCred.username,
        password: userCred.pass
      }
*/
      // NOTE that a PUT request to the above, not to /data/services/auth as
      // specified in the XNAT API documentation, returns an "invalid CSRF",
      // but also gives a JSESSIONID which allows log in via a GET request to
      // the XNAT server (tested in Postman)

      // or we can try a post to /data/JSESSION, as in XNAT API documentation
      // this returns a JSESSIONID, which is registered with user (checked curl)
      // in postman, we get an invalid CSRF again, but we can access that user's
      // XNAT using that JSESSIONID...
      axios({
        method: 'post',
        url: `${chosenXnat.url}/data/JSESSION`,
        auth: {
          username: userCred.username,
          password: userCred.pass
        }

    }).then(function (response) {

      res.send(response.data);

    });
  });

// listening on port 3000
app.listen(3000);
