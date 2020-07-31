// input-form-parsing.js
// to turn form input from homepage into sensible stuff for xml

// process the entries from the search page:
// modality
function parseModality (modality) {
  let rootElement;
  switch(modality) {
    case 'CT': {
      rootElement = 'xnat:ctSessionData';
      break;
    }
    case 'MRI': {
      rootElement = 'xnat:mrSessionData';
      break;
    }
    case 'PET': {
      rootElement = 'xnat:petSessionData';
      break;
    }
    default: {
      console.log('No modality selected');
      break;
    }
  }
  return rootElement;
}

// patient gender
function parsePatientGender (gender) {
  let patientGender;
  switch(gender) {
    case 'Female': {
      patientGender = 'F';
      break;
    }
    case 'Male': {
      patientGender = 'M';
      break;
    }
    case 'Unknown': {
      patientGender = 'U';
      break;
    }
    default: {
      patientGender = 'U';
      break;
    }
  }
  return patientGender;
}

module.exports = {
  modalityParser: parseModality,
  genderParser: parsePatientGender
}
