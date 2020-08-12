// search.js

//requirements from node
const express = require('express');
const router = express.Router();
const axios = require('axios');
const xml = require('xml');

// local requirements
const createSearchXml = require('../code/xml-creation');

// make POST route for searching XNAT
// overall route is /search
router.post('/search', (req, res) => {

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

  // make the request using the xml with axios
  let url = 'XNAT-URL';
  axios.post(url, searchXml, {
    headers: {'content-type': 'application/xml'},
    auth: {
      username: 'USERNAME',
      password: 'PASSWORD'
    }
  }).then(function (response) {
    //console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    //console.log(response.headers);
    //console.log(response.config);
  });

  // redirect to page for displaying search results
  res.render('search-results', { results: searchParams });
})

module.exports = router;
