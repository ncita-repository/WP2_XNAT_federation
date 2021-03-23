// search.js

// requirements from node
const express = require('express');
const router = express.Router();
const axios = require('axios');
const xml = require('xml');

// local requirements
const createSearchXml = require('../code/xml-creation');

// make POST route for searching XNAT
// overall route is /search
router.post('/search', (req, res) => {

  if (req.isAuthenticated()) {

    // get search query out of request object
    let searchParams = req.body;

    // and get out each form input
    let rootElement = searchParams.modality;
    let startDate = searchParams.startDate;
    let stopDate = searchParams.stopDate;
    let subjectGender = searchParams.gender;
    let subjectAgeMin = searchParams.minimumAge;
    let subjectAgeMax = searchParams.maximumAge;

    // create an xml to search XNAT
    let searchXml = createSearchXml(rootElement, startDate, stopDate, subjectGender,
      subjectAgeMin, subjectAgeMax);

    // get out the list of XNATs from the user object
    let userXnats = req.user.xnats;

    // make an array of axios requests
    let axReqs = [];
    for (let i = 0; i < userXnats.length; i++) {

      // define things to put in the request
      let currentXnat = userXnats[i];
      let username = currentXnat.username;
      let password = currentXnat.password;
      let url = `${currentXnat.url}/data/search?format=json`;

      console.log(`getting from XNAT ${url}`);
      console.log(`with username: ${username}`);
      console.log(`and password: ${password}`);

      // construct the request
      let currentRequest = axios.post(url, searchXml, {
        headers: {'content-type': 'application/xml'},
        auth: {
          username: username,
          password: password
        }
      });

      // and add to the request array
      axReqs.push(currentRequest);
    }

    // now make all of the requests concurrently
    console.log(axReqs);
    axios.all(axReqs).then(responseArr => {

      // start an array to append values to
      let results = [];
      for (let i = 0; i < responseArr.length; i++) {
        results.push(responseArr[i].data.ResultSet.Result);
      }

      // send all returned results to
      console.log(results);
      res.render('search-results', { user: req.user, results: results });

    });
  } else {
    res.redirect('/');
  }

})

module.exports = router;
