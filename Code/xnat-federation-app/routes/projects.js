// projects.js

// requirements
const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET route for querying XNAT for all projects
// note overall route is /xnat-query/projects
router.get('/projects', (req, res) => {
  console.log('In projects route');

  // get out the list of XNATs from the user object
  const userXnats = req.user.xnats;

  // make an array of axios requests
  let axReqs = [];
  for (let i = 0; i < userXnats.length; i++) {

    // define things to put in the request
    let currentXnat = userXnats[i];
    let username = currentXnat.username;
    let password = currentXnat.password;
    let url = `${currentXnat.url}/data/projects`;

    console.log('Inside the request maker');
    console.log(`getting from XNAT ${url}`);
    console.log(`with username: ${username}`);
    console.log(`and password: ${password}`);

    // construct the request
    let currentRequest = axios.get(url, {
      auth: {
        username: username,
        password: password
      }
    });

    console.log(`current request: ${currentRequest}`);

    // and add to the request array
    axReqs.push(currentRequest);
  }

  console.log(axReqs);

  axios.all(axReqs).then(responseArr => {

    // start an array to append values to
    let allProjects = [];
    for (let i = 0; i < responseArr.length; i++) {
      allProjects.push(responseArr[i].data.ResultSet.Result);
    }

    console.log(allProjects);
    res.render('projects', { user: req.user, projects: allProjects });

  });
});

module.exports = router;
