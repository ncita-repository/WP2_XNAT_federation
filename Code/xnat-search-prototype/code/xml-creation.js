// xml-creation.js

// requirements
const xml = require('xml');

function createSearchXml (rootElement, patientGender) {
  console.log('Inside the create search xml function');

  // build the components of the search xml:
  // xdat search parameters first
  let xdatSearchParams = { _attr: {
    'ID': '',
    'allow-diff-columns': '0',
    'secure': 'false',
    'xmlns:xdat': 'http://nrg.wustl.edu/security',
    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
  } };

  // define the root element
  let xdatRootElement = { 'xdat:root_element_name': rootElement };

  // make search fields
  // initially hard-coded, here. TODO: allow entry of search fields
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
    [ { 'xdat:element_name': subjectData },
    { 'xdat:field_ID': 'SUBJECT_LABEL' },
    { 'xdat:sequence': '3' },
    { 'xdat:type': 'string' },
    { 'xdat:header': 'Subject' } ]
  };

  let xdatSearchFieldGender = { 'xdat:search_field':
    [ { 'xdat:element_name': subjectData },
    { 'xdat:field_ID': 'GENDER_TEXT' },
    { 'xdat:sequence': '4' },
    { 'xdat:type': 'string' },
    { 'xdat:header': 'M/F' } ]
  };



}

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

// export the function
module.exports = createSearchXml;
