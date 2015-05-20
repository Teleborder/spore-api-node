module.exports = Users;

function Users(api) {
  this.api = api;
}

Users.prototype.signup = function (email, password, callback) {
  var users = this,
      data = {
        email: email,
        password: password
      };

  this.api.post(this.api.path('users'), { data: data }, function (err, json, _body, res) {
    if(err) return callback(err);

    if(res.statusCode === 202) {
      return callback(new Error("Request to create " + email + " accepted, but it's not finished yet. Log in later to retrieve your API credentials."));
    }

    var user = json.user;

    users.login(email, password, function (err, key) {
      if(err) return callback(err);

      user.key = key;

      callback(null, user);
    });
  });
};

Users.prototype.login = function (email, password, callback) {
  var data = {
    password: password
  };

  this.api.post(this.api.path('keys', { email: email }), { data: data }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.key);
  });
};

Users.prototype.verify = function (token, callback) {
  if(!this.api.email) return callback(new Error("You need to set up an email address to confirm it."));

  var data = {
    token: token
  };

  this.api.patch(this.api.path('user', { email: this.api.email }), { data: data }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.user);
  });
};
