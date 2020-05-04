var records = [
    { id: 1,
      username: 'user1',
      password: 'topSecret',
      displayName: 'User',
      xnats: [{ id: 1, instance: 'Local'}],
      emails: [ { value: 'user@example.com' } ] }
  , { id: 2,
      username: 'admin',
      password: 'adminSecret',
      displayName: 'Admin',
      xnats: [{ id: 1, instance: 'Local'}],
      emails: [ { value: 'admin@example.com' } ] }
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
