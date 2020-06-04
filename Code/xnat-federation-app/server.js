// server.js
console.log('XNAT fed app is GO!')

// requirements
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const { v4: uuid } = require('uuid');
const axios = require('axios');

// requirements with files for setup
const passport = require('./passport/setup');
const auth = require('./routes/auth');
const projects = require('./routes/projects');

// start an instance of Express
const app = express();
const PORT = 3000;

// configure view engine for ejs
app.set('views', './views');
app.set('view engine', 'ejs');

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// session, with unique id generation
app.use(session({
  genid: (req) => {
    console.log(`Session middleware, id: ${req.sessionID}`)
    return uuid() // use UUIDs for session IDs
  },
  // for store here, we could use mongodb
  store: new FileStore(),
  secret: 'keyboard cat', // change in prod.
  resave: false,
  saveUnitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// routes:
// homepage
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

// authorise user
app.use('/login', auth);

// profile page
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('profile', { user: req.user });
  } else {
    res.redirect('/');
  }
});

// query XNAT for all projects
app.use('/xnat-query', projects);

// listen...
app.listen(PORT, () => console.log(`...and listening on port ${PORT}`));
