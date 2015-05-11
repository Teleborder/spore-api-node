var apiSupport = require('./support');

// Add our support methods
for(var methodName in apiSupport) {
  exports[methodName] = apiSupport[methodName];
}

exports.signup = function (email, password, callback) {
  this._post("/signup", { email: email, password: password }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.user);
  });
};

exports.login = function (email, password, callback) {
  this._post("/login", { email: email, password: password }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.user);
  });
};

exports.createApp = function (name, callback) {
  this._authPost("/apps", { name: name }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  });
};

exports.listApps = function (callback) {
  this._authGet("/apps", function (err, json) {
    if(err) return callback(err);

    callback(null, json.apps);
  });
};

exports.getApp = function (appName, callback) {
  this._authGet("/apps/" + appName, function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  });
};

exports.changeAppOwner = function (name, email, callback) {
  this._authPost("/apps/" + appName, { email: email }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  });
};

exports.listAppUsers = function (appName, callback) {
  this._authGet("/apps/" + appName + "/users", function (err, json) {
    if(err) return callback(err);

    callback(null, json.users);
  });
};

exports.inviteToApp = function (appName, email, callback) {
  this._authPost("/apps/" + appName + "/users", { email: email }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.user);
  });
};

exports.getEnv = function (appName, envName, callback) {
  this._authGet("/apps/" + appName + "/envs/" + envName, function (err, json) {
    if(err) return callback(err);

    callback(null, json.env);
  });
};

exports.listEnvUsers = function (appName, envName, callback) {
  this._authGet("/apps/" + appName + "/envs/" + envName + "/users", function (err, json) {
    if(err) return callback(err);

    callback(null, json.users);
  });
};

exports.inviteToEnv = function (appName, envName, email, callback) {
  this._authPost("/apps/" + appName + "/envs/" + envName + "/users", { email: email }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.user);
  });
};

exports.getDotEnvy = function (appName, envName, callback) {
  this._authGet("/apps/" + appName + "/envs/" + envName + "/.envy", function (err, _json, body) {
    if(err) return callback(err);

    callback(null, body);
  });
};

exports.updateEnv = function (appName, envName, data, callback) {
  if(!data || !Object.keys(data).length) {
    return callback(new Error("At least one variable must be set to update the environment."));
  }

  this._authPost("/apps/" + appName + "/envs/" + envName, data, function (err, json) {
    if(err) return callback(err);

    callback(null, json.env);
  });
};

exports.set = function (appName, envName, key, value, callback) {
  var data = {};
  data[key] = value;

  this.updateEnv(appName, envName, data, callback);
};
