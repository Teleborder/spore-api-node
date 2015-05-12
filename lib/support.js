var request = require('request');

exports._authPost = function (path, data, callback) {
  if(!this.key) return callback(new Error("A key must be set to make authenticated requests."));

  this._post(path, data, { key: this.key }, callback);
};

exports._authGet = function (path, callback) {
  if(!this.key) return callback(new Error("A key must be set to make authenticated requests."));

  this._get(path, { key: this.key }, callback);
};

exports._post = function (path, data, qs, callback) {
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
    handleResponse(callback)
  );
};

exports._get = function (path, qs, callback) {
  if(!callback) {
    callback = qs;
    qs = {};
  }

  request.get(
    this._url(path),
    {
      qs: qs
    },
    handleResponse(callback)
  );
};

exports._url = function (path) {
  var url = this.protocol + "://" + this.host;

  if(!this._usesDefaultPort()) {
    url += ":" + this.port;
  }

  url += path;

  return url;
};

exports._usesDefaultPort = function () {
  return (this.protocol === "http" && this.port.toString() === "80") ||
    (this.protocol === "https" && this.port.toString() === "443");
};

exports.defaultPortFor = function (protocol) {
  if(protocol === "http") {
    return 80;
  }

  if(protocol === "https") {
    return 443;
  }
}

function handleResponse (callback) {
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
}
