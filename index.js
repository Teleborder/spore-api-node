var request = require('request');

module.exports = Envy;

function Envy(options) {
  options = options || {};
  this.host = options.host || "envy.dev";
  this.port = options.port || 3000;
  this.protocol = options.protocol || "http";
}

Envy.prototype.signup = function (email, password, callback) {
  this.post("/signup", { email: email, password: password }, function (err, body) {
    if(err) return callback(err);

    callback(null, body.user.key);
  });
};

Envy.prototype.login = function (email, password, callback) {
  this.post("/login", { email: email, password: password }, function (err, body) {
    if(err) return callback(err);

    callback(null, body.user.key);
  });
};

Envy.prototype.post = function (path, data, callback) {
  request.post(
    this.url(path),
    { form: data },
    this._handleResponse(callback)
  );
};

Envy.prototype.get = function (path, callback) {
  request.get(
    this.url(path),
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

Envy.prototype.url = function (path) {
  var url = this.protocol + "://" + this.host;

  if(!this.usesDefaultPort()) {
    url += ":" + this.port;
  }

  url += path;

  return url;
};

Envy.prototype.usesDefaultPort = function () {
  return (this.protocol === "http" && this.port.toString() === "80") ||
    (this.protocol === "https" && this.port.toString() === "443");
};
