// xml-creation.js

// requirements
const xml = require('xml');

// "master" function to put the XML elements together
function createSearchXml (rootElement, startDate, stopDate, subjectGender,
  subjectAgeMin, subjectAgeMax) {

  // BUILD COMPONENTS OF XML
  // xnat "bundle"
  let xdatBundle = { _attr: {
    'ID': '',
    'allow-diff-columns': '0',
    'secure': 'false',
    'xmlns:xdat': 'http://nrg.wustl.edu/security',
    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
  } };

  // xnat root element
  let xdatRootElement = { 'xdat:root_element_name': rootElement };

  // returned fields from search
  let xdatSearchFields = createXmlSearchFields(rootElement);

  // SEARCH CRITERIA XML
  // project start/stop date
  let xdatSearchWhereDate = createXmlSearchWhereDate(rootElement, startDate, stopDate);

  // subject gender
  let xdatSearchWhereGender = createXmlSearchWhereGender(subjectGender);

  // subject age
  let xdatSearchWhereAge = createXmlSearchWhereAge(rootElement, subjectAgeMin, subjectAgeMax);

  // test if there are search criteria
  // then put the XML together
  let allSearchParams = [xdatSearchWhereDate,xdatSearchWhereGender,xdatSearchWhereAge];
  const isNotEmpty = (element) => Object.entries(element).length > 0;
  let searchCriteria;
  if (allSearchParams.some(isNotEmpty)) {
    searchCriteria = [ { 'xdat:search':
      [ xdatBundle,
        xdatRootElement,
        xdatSearchFields.xdatSearchFieldLabel,
        xdatSearchFields.xdatSearchFieldProject,
        xdatSearchFields.xdatSearchFieldDate,
        xdatSearchFields.xdatSearchFieldSubject,
        xdatSearchFields.xdatSearchFieldGender,
        xdatSearchFields.xdatSearchFieldAge,
        { 'xdat:search_where': [ { _attr: { 'method': 'AND' } },
        xdatSearchWhereDate,
        xdatSearchWhereGender,
        xdatSearchWhereAge ] }
      ]
    } ];
  } else {
    searchCriteria = [ { 'xdat:search':
      [ xdatBundle,
        xdatRootElement,
        xdatSearchFields.xdatSearchFieldLabel,
        xdatSearchFields.xdatSearchFieldProject,
        xdatSearchFields.xdatSearchFieldDate,
        xdatSearchFields.xdatSearchFieldSubject,
        xdatSearchFields.xdatSearchFieldGender,
        xdatSearchFields.xdatSearchFieldAge,
      ]
    } ];
  }

  // log to check our xml
  //console.log(searchCriteria);
  console.log(xml(searchCriteria, { indent: '\t', declaration: true }));

  // create the xml to send off in the search
  let searchXml = xml(searchCriteria, { declaration: true });
  return searchXml;
}

// creates the returned search data
function createXmlSearchFields (rootElement) {

  // make returned fields individually
  // initially hard-coded, here
  // TODO: allow variable search fields
  let xdatSearchFieldLabel = { 'xdat:search_field':
    [ { 'xdat:element_name': rootElement },
    { 'xdat:field_ID': 'LABEL' },
    { 'xdat:sequence': '0' },
    { 'xdat:type': 'string' },
    { 'xdat:header': 'Session label' } ]
  };

  let xdatSearchFieldProject = { 'xdat:search_field':
    [ { 'xdat:element_name': rootElement },
    { 'xdat:field_ID': 'PROJECT' },
    { 'xdat:sequence': '1' },
    { 'xdat:type': 'string' },
    { 'xdat:header': 'Project' } ]
  };

  let xdatSearchFieldDate = { 'xdat:search_field':
    [ { 'xdat:element_name': rootElement },
    { 'xdat:field_ID': 'DATE' },
    { 'xdat:sequence': '2' },
    { 'xdat:type': 'string' },
    { 'xdat:header': 'Date' } ]
  };

  let xdatSearchFieldSubject = { 'xdat:search_field':
    [ { 'xdat:element_name': 'xnat:subjectData' },
    { 'xdat:field_ID': 'SUBJECT_LABEL' },
    { 'xdat:sequence': '3' },
    { 'xdat:type': 'string' },
    { 'xdat:header': 'Subject' } ]
  };

  let xdatSearchFieldGender = { 'xdat:search_field':
    [ { 'xdat:element_name': 'xnat:subjectData' },
    { 'xdat:field_ID': 'GENDER_TEXT' },
    { 'xdat:sequence': '4' },
    { 'xdat:type': 'string' },
    { 'xdat:header': 'M/F' } ]
  };

  let xdatSearchFieldAge = { 'xdat:search_field':
    [ { 'xdat:element_name': rootElement },
    { 'xdat:field_ID': 'AGE' },
    { 'xdat:sequence': '5' },
    { 'xdat:type': 'float' },
    { 'xdat:header': 'Age' } ]
  };

  // put all of the fields together
  let xdatSearchFields = {
    xdatSearchFieldLabel,
    xdatSearchFieldProject,
    xdatSearchFieldDate,
    xdatSearchFieldSubject,
    xdatSearchFieldGender,
    xdatSearchFieldAge,
  };
  return xdatSearchFields;
}

// creates the project start and stop date search criteria
function createXmlSearchWhereDate(rootElement, startDate, stopDate) {

  // initialise the variable to return after the switches below
  let xdatSearchWhereDate;

  // switch through possible combinations of start/stop dates
  switch (startDate) {
    case '': {
      switch (stopDate) {
        case '': {
          xdatSearchWhereDate = [];
          break
        }
        default: {
          xdatSearchWhereDate =
          { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
            { 'xdat:schema_field': rootElement+'.DATE' },
            { 'xdat:comparison_type': '<' },
            { 'xdat:value': stopDate }
          ] };
          break
        }
      }
      break
    }
    default: {
      switch (stopDate) {
        case '': {
          xdatSearchWhereDate =
            { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
            { 'xdat:schema_field': rootElement+'.DATE' },
            { 'xdat:comparison_type': '>' },
            { 'xdat:value': startDate }
          ] };
          break
        }
        default: {
          xdatSearchWhereDate =
            { 'xdat:child_set': [ { _attr: { 'method': 'AND' } },
              { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
              { 'xdat:schema_field': rootElement+'.DATE' },
              { 'xdat:comparison_type': '>' },
              { 'xdat:value': startDate }
            ] },
              { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
              { 'xdat:schema_field': rootElement+'.DATE' },
              { 'xdat:comparison_type': '<' },
              { 'xdat:value': stopDate }
            ] }
          ] };
          break
        }
      }
      break
    }
  }
  return xdatSearchWhereDate;
}

// creates the subject gender search criteria
function createXmlSearchWhereGender(subjectGender) {

  // initialise the variable to return after the switches below
  let xdatSearchWhereGender;

  // switch through possible options for subject gender
  switch (subjectGender) {
    case 'U': {
      xdatSearchWhereGender = [];
      break
    }
    default: {
      xdatSearchWhereGender =
        { 'xdat:child_set' : [ { _attr: { 'method': 'OR' } },
          { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
          { 'xdat:schema_field': 'xnat:subjectData.GENDER_TEXT' },
          { 'xdat:comparison_type': 'LIKE' },
          { 'xdat:value': subjectGender }
        ] },
          { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
          { 'xdat:schema_field': 'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/gender' },
          { 'xdat:comparison_type': 'LIKE' },
          { 'xdat:value': subjectGender }
        ] }
      ] }
      break
    }
  }
  return xdatSearchWhereGender;
}

// creates the subject age search criteria
function createXmlSearchWhereAge(rootElement, subjectAgeMin, subjectAgeMax) {

  // initialise the variable to return after the switches below
  let xdatSearchWhereAge;

  // switch through possible options for subject age
  switch (subjectAgeMin) {
    case '': {
      switch (subjectAgeMax) {
        case '': {
          xdatSearchWhereAge = [];
          break
        }
        default: {
          xdatSearchWhereAge =
          { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
            { 'xdat:schema_field': rootElement+'.AGE' },
            { 'xdat:comparison_type': '<=' },
            { 'xdat:value': subjectAgeMax }
          ] };
          break
        }
      }
      break
    }
    default: {
      switch (subjectAgeMax) {
        case '': {
          xdatSearchWhereAge =
            { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
            { 'xdat:schema_field': rootElement+'.AGE' },
            { 'xdat:comparison_type': '>=' },
            { 'xdat:value': subjectAgeMin }
          ] };
          break
        }
        default: {
          xdatSearchWhereAge =
            { 'xdat:child_set': [ { _attr: { 'method': 'AND' } },
              { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
              { 'xdat:schema_field': rootElement+'.AGE' },
              { 'xdat:comparison_type': '>=' },
              { 'xdat:value': subjectAgeMin }
            ] },
              { 'xdat:criteria': [ { _attr: { 'override_value_formatting': '0' } },
              { 'xdat:schema_field': rootElement+'.AGE' },
              { 'xdat:comparison_type': '<=' },
              { 'xdat:value': subjectAgeMax }
            ] }
          ] };
          break
        }
      }
      break
    }
  }
  return xdatSearchWhereAge;
}

// export the function
module.exports = createSearchXml;
