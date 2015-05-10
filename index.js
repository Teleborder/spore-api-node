var request = require('request');

module.exports = Envy;

function Envy(options) {
  options = options || {};
  this.host = options.host || "envy.dev";
  this.port = options.port || 3000;
  this.protocol = options.protocol || "http";
  this.key = options.key || null;
}

// Administrative Methods (Public)

Envy.prototype.setKey = function (key) {
  this.key = key;

  return this;
};

// API Methods (Public)

Envy.prototype.signup = function (email, password, callback) {
  this._post("/signup", { email: email, password: password }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.user);
  });
};

Envy.prototype.login = function (email, password, callback) {
  this._post("/login", { email: email, password: password }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.user);
  });
};

Envy.prototype.createApp = function () {

};

Envy.prototype.listApps = function (callback) {
  this._authGet("/apps", function (err, json) {
    if(err) return callback(err);

    callback(null, json.apps);
  });
};

Envy.prototype.getApp = function (appName, callback) {
  this._authGet("/apps/" + appName, function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  });
};

Envy.prototype.listAppUsers = function (appName, callback) {
  this._authGet("/apps/" + appName + "/users", function (err, json) {
    if(err) return callback(err);

    callback(null, json.users);
  });
};

Envy.prototype.inviteToApp = function () {
  // Not implemented on server
};

Envy.prototype.getEnv = function (appName, envName, callback) {
  this._authGet("/apps/" + appName + "/env/" + envName, function (err, json) {
    if(err) return callback(err);

    callback(null, json.env);
  });
};

Envy.prototype.listEnvUsers = function () {
  this._authGet("/apps/" + appName + "/env/" + envName + "/users", function (err, json) {
    if(err) return callback(err);

    callback(null, json.users);
  });
};

Envy.prototype.inviteToEnv = function () {
  // Not implemented on server
};

Envy.prototype.getDotEnvy = function () {

};

Envy.prototype.set = function () {

};

// API Support (Private)

Envy.prototype._authPost = function (path, data, callback) {
  if(!this.key) return callback(new Error("A key must be set to make authenticated requests."));

  this.post(path, data, { key: this.key }, callback);
};

Envy.prototype._authGet = function (path, callback) {
  if(!this.key) return callback(new Error("A key must be set to make authenticated requests."));

  this._get(path, { key: this.key }, callback);
};


Envy.prototype._post = function (path, data, qs, callback) {
  if(!callback) {
    callback = qs;
    qs = {};
  }

  request.post(
    this._url(path),
    {
      form: data,
      qs: qs
    },
    this._handleResponse(callback)
  );
};

Envy.prototype._get = function (path, qs, callback) {
  if(!callback) {
    callback = qs;
    qs = {};
  }

  request.get(
    this._url(path),
    {
      qs: qs
    },
    this._handleResponse(callback)
  );
};

Envy.prototype._handleResponse = function (callback) {
  return function (err, res, body) {
    if(err) return callback(err);

    var json;
    try {
      json = JSON.parse(body);
    } catch(e) {
      json = {};
    }

    if(res.statusCode !== 200) {

      if(json.error) {
        err = new Error(json.error.message);
      } else {
        err = new Error("Unknown Error with status " + res.statusCode + "\n" + body);
      }

      return callback(err);
    }

    callback(null, json, body, res);
  };
};

Envy.prototype._url = function (path) {
  var url = this.protocol + "://" + this.host;

  if(!this._usesDefaultPort()) {
    url += ":" + this.port;
  }

  url += path;

  return url;
};

Envy.prototype._usesDefaultPort = function () {
  return (this.protocol === "http" && this.port.toString() === "80") ||
    (this.protocol === "https" && this.port.toString() === "443");
};
