var records = [
    { id: 1,
      username: 'user1',
      xnats: [{ id: 1, instance: 'Local', username: 'user', pass: 'secret' }] }
  , { id: 2,
      username: 'admin',
      xnats: [{ id: 1, instance: 'Local', username: 'admin', pass: 'admin'}] }
];

exports.findUserXnat = function(uId, xId) {

  // look for the user with the id matching the input
  let userMatches = [];
  records.forEach((element, idx) => {
    userMatches[idx] = element.id == uId;
  });

  // get out this user
  let userIdx = userMatches.indexOf(true);
  let thisUser = records[userIdx];

  // now look for matches of the xnat id
  let xnatMatches = [];
  thisUser.xnats.forEach((element, idx) => {
    xnatMatches[idx] = element.id == xId;
  });

  // get out this xnat instance user details
  let xnatIdx = xnatMatches.indexOf(true);
  return thisUser.xnats[xnatIdx];

}
