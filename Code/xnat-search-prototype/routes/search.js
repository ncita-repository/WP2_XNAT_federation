// search.js

//requirements from node
const express = require('express');
const router = express.Router();
const axios = require('axios');
const xml = require('xml');

// local requirements
const formParsing = require('../code/input-form-parsing');
const parseModality = formParsing.modalityParser;
const parsePatientGender = formParsing.genderParser;

// make POST route for searching XNAT
// overall route is /search
router.post('/search', (req, res) => {
  console.log('Inside /search callback');

  // get search query out of request object
  let searchResults = req.body;
  console.log(searchResults);

  // parse the search form inputs
  let rootElement = parseModality(searchResults.modality);
  let patientGender = parsePatientGender(searchResults.gender);
  console.log(`root element is: ${rootElement}`);
  console.log(`patient gender is: ${patientGender}`);

  // build an xml document including searched terms
  // TODO: put in loop for the search fields
  let searchCriteria = [ { 'xdat:search':
    [ { _attr: {
      'ID': '',
      'allow-diff-columns': '0',
      'secure': 'false',
      'xmlns:xdat': 'http://nrg.wustl.edu/security',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
    } },
    { 'xdat:root_element_name': rootElement },
    { 'xdat:search_field':
      [ { 'xdat:element_name': 'xnat:mrSessionData' },
      { 'xdat:field_ID': 'LABEL' },
      { 'xdat:sequence': '0' },
      { 'xdat:type': 'string' },
      { 'xdat:header': 'MR ID' } ]
    },
    { 'xdat:search_field':
      [ { 'xdat:element_name': 'xnat:subjectData' },
      { 'xdat:field_ID': 'LABEL' },
      { 'xdat:sequence': '1' },
      { 'xdat:type': 'string' },
      { 'xdat:header': 'Subject' } ]
    },
    { 'xdat:search_where': [ { _attr: { 'method': 'OR' } },
      { 'xdat:child_set': [ { _attr: { 'method': 'AND' } },
        { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
          { 'xdat:schema_field': 'xnat:mrSessionData/sharing/share/project' },
          { 'xdat:comparison_type': '=' },
          { 'xdat:value': 'CENTRAL_OASIS_CS' }
        ] },
        { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
          { 'xdat:schema_field': 'xnat:subjectData.GENDER_TEXT' },
          { 'xdat:comparison_type': 'LIKE' },
          { 'xdat:value': patientGender }
        ] }
      ] },
      { 'xdat:child_set': [ { _attr: { 'method': 'AND' } },
        { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
          { 'xdat:schema_field': 'xnat:mrSessionData/PROJECT' },
          { 'xdat:comparison_type': '=' },
          { 'xdat:value': 'CENTRAL_OASIS_CS' }
        ] },
        { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
          { 'xdat:schema_field': 'xnat:subjectData.GENDER_TEXT' },
          { 'xdat:comparison_type': 'LIKE' },
          { 'xdat:value': patientGender }
        ] }
      ] },
      { 'xdat:child_set': [ { _attr: { 'method': 'AND' } },
        { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
          { 'xdat:schema_field': 'xnat:mrSessionData/sharing/share/project' },
          { 'xdat:comparison_type': '=' },
          { 'xdat:value': 'CENTRAL_OASIS_CS' }
        ] },
        { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
          { 'xdat:schema_field': 'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/gender' },
          { 'xdat:comparison_type': 'LIKE' },
          { 'xdat:value': patientGender }
        ] }
      ] },
      [],
      { 'xdat:child_set': [ { _attr: { 'method': 'AND' } },
        { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
          { 'xdat:schema_field': 'xnat:mrSessionData/PROJECT' },
          { 'xdat:comparison_type': '=' },
          { 'xdat:value': 'CENTRAL_OASIS_CS' }
        ] },
        { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
          { 'xdat:schema_field': 'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/gender' },
          { 'xdat:comparison_type': 'LIKE' },
          { 'xdat:value': patientGender }
        ] }
      ] }
    ] }
    ]
  } ];

  // log to check our xml
  console.log(xml(searchCriteria, { indent: '\t', declaration: true }));

  // create the xml to send off in the search
  let searchXML = xml(searchCriteria, { declaration: true });

  // make the request using the xml with axios
  let url = 'XNAT_URL';
  axios.post(url, searchXML, {
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
  res.render('search-results', { results: searchResults });
})

module.exports = router;
