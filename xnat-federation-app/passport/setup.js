// setup.js, for passport configuration

// requirements
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const axios = require('axios');

// tell passport how to serialise the user
passport.serializeUser((user, done) => {
  console.log('Inside serializeUser callback. User id saved here to FileStore');
  done(null, user.id);
});

// ...and how to deserialize user
passport.deserializeUser((id, done) => {
  console.log('Inside deserializeUser callback')
  console.log(`The user id passport saved in the session file store is: ${id}`)
  axios.get(`http://localhost:5000/users/${id}`)
    .then(res => done(null, res.data))
    .catch(error => done(error, false))
});

// configure passport to use local strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    console.log('Inside the local strategy callback')
    axios.get(`http://localhost:5000/users?email=${email}`) // go to JSON REST endpoint
      .then(res => {
        const user = res.data[0]
        if (!user) {
          return done(null, false, { message: 'Invalid credentials.\n' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: 'Invalid password.\n'});
        }
        return done(null, user);
      })
      .catch(error => done(error));
  }
));

module.exports = passport;
