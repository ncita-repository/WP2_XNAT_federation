// xnats.js
console.log('xnats file linked!');

// find all of the XNAT buttons
xnatButtons = document.querySelectorAll("button");

// add an event listener for each
// when a button is clicked, we will get its id and send a post to server
xnatButtons.forEach(btn => {
  btn.addEventListener('click', event => {

    // put the ID of the selected XNAT instance in the search params
    const searchParam = new URLSearchParams();
    searchParam.append('xnatID', btn.id);

    // make the post request to the server
    fetch('/xnats', {
      method: 'post',
      body: searchParam
    }).then(async function (response) {

      let seshId = await response.text();
      console.log(seshId);

    }).then(function (seshId) {

      // THEN WHAT? The below attempts do not work, in that they just get a 302
      // response from the XNAT in question. 
      // comment out as appropriate...

      // Try a get request to the XNAT instance and set the session id as a
      // header. This returns a 302 status from the chosen XNAT.
/*
      fetch(`${btn.value}/app/template/Index.vm`, {
        header: seshId,
        mode: 'no-cors',
        redirect: 'follow'
      });
*/

      // Or try a get request to chosen XNAT this way?
      // This also gives a 302 response
      fetch(`${btn.value}/app/template/Index.vm`, {
        method: 'get',
        headers: {
          'JSESSIONID': seshId
        },
        mode: 'no-cors'
      })


    })
  })
});
