module.exports = Users;

function Users(api) {
  this.api = api;
}

Users.prototype.signup = function (email, password, callback) {
  var users = this;

  this.api.post(this.api.path('users'), { email: email, password: password }, function (err, json) {
    if(err) return callback(err);

    var user = json.user;

    users.login(email, password, function (err, key) {
      if(err) return callback(err);

      user.key = key;

      callback(null, user);
    });
  });
};

Users.prototype.login = function (email, password, callback) {
  this.api.post(this.api.path('keys', { email: email }), { password: password }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.key);
  });
};

Users.prototype.verify = function (token, callback) {
  if(!this.api.email) return callback(new Error("You need to set up an email address to confirm it."));

  this.api.patch(this.api.path('user', { email: this.api.email }), { token: token }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.user);
  });
};
