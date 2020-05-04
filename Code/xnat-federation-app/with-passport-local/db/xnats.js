var records = [
    { id: 1,
      instance: 'Local',
      url: 'http://10.1.1.17' }
];

exports.findXnat = function(id) {

  // look for the instance with an id matching the input
  let matches = [];
  records.forEach((element, idx) => {
    matches[idx] = element.id == id;
  });

  // find the entry with the matching instance
  let xnatIdx = matches.indexOf(true);
  return records[xnatIdx];

}
