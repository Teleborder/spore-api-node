var req = require('request'),
    paths = require('./paths'),
    Errors = require('spore-errors');

exports.authPost = authRequest('post', true);
exports.authPatch = authRequest('patch', true);
exports.authGet = authRequest('get');
exports.authDelete = authRequest('delete');

exports.post = request('post', true);
exports.patch = request('patch', true);
exports.get = request('get');
exports.delete = request('del');

exports._url = function (path) {
  var url = this.protocol + "://" + this.hostname;

  if(!this._usesDefaultPort()) {
    url += ":" + this.port;
  }

  url += path;

  return url;
};

exports._callback = function (callback) {
  var hooks = this._hooks || [];

  return function () {
    var ctx = this,
        args = [].slice.call(arguments);

    hooks.forEach(function (hook) {
      hook.apply(ctx, args);
    });

    callback.apply(ctx, args);
  };
};

exports.path = function (name, params) {
  var path = paths[name],
      re = /\/:([a-zA-Z0-9]+)/,
      result;

  if(!path) throw new Error("Invalid Path `" + name + "`");

  params = params || {};

  while((result = re.exec(path)) !== null) {
    path = path.replace(':' + result[1], params[result[1]]);
  }

  return path;
};

exports._usesDefaultPort = function () {
  return this.defaultPortFor(this.protocol) && this.port &&
    this.defaultPortFor(this.protocol).toString() === this.port.toString();
};

exports.defaultPortFor = function (protocol) {
  if(protocol === "http") {
    return 80;
  }

  if(protocol === "https") {
    return 443;
  }
};

function authRequest(method, useData) {
  return function (path, data, callback) {
    if(!this.key) return callback(new Error("A key must be set to make authenticated requests."));
    if(!this.email) return callback(new Error("An email must be set to make authenticated request."));

    var args = [path];

    if(useData) {
      args.push(data);
    } else {
      callback = data;
      data = null;
    }

    args.push({
      key: this.key,
      email: this.email
    });

    args.push(callback);

    this[method].apply(this, args);
  };
}

function request(method, useData) {
  return function (path, data, qs, callback) {
    var args = [this._url(path)];

    if(!useData) {
      callback = qs;
      qs = data;
      data = undefined;
    }

    if(!callback) {
      callback = qs;
      qs = {};
    }

    args.push({
      qs: qs,
      form: data
    });

    args.push(handleResponse(this._callback(callback)));

    req[method].apply(req, args);
  };
}

function handleResponse (callback) {
  return function (err, res, body) {
    if(err) {
      err.code = Errors.noConnection.code;
      return callback(err);
    }

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
