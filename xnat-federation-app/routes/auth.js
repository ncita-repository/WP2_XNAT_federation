// auth.js

// requirements
const express = require('express');
const router = express.Router();
const passport = require('passport');

// create POST route for logging in
// note overall route is /login/auth
router.post('/auth', (req, res, next) => {
  console.log('Inside POST /login/auth callback');
  passport.authenticate('local', (err, user, info) => {
    console.log('Inside passport.authenticate() callback');
    console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
    console.log(`req.user: ${JSON.stringify(req.user)}`);
    if(info) { return res.send(info.message) }
    if(err) { return next(err); }
    if(!user) { return res.redirect('/'); }
    req.login(user, (err) => {
      console.log('Inside req.login() callback')
      console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user: ${JSON.stringify(req.user)}`)
      if (err) { return next(err); }
      return res.redirect('/');
    })
  })(req, res, next);
});

module.exports = router;
