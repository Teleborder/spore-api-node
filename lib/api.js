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

exports.getApp = function (appId, callback) {
  this._authGet("/apps/" + appId, function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  });
};

exports.changeAppOwner = function (appId, email, callback) {
  this._authPost("/apps/" + appId, { email: email }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  });
};

exports.listAppUsers = function (appId, callback) {
  this._authGet("/apps/" + appId + "/users", function (err, json) {
    if(err) return callback(err);

    callback(null, json.users);
  });
};

exports.inviteToApp = function (appId, email, callback) {
  this._authPost("/apps/" + appId + "/users", { email: email }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.user);
  });
};

exports.getEnv = function (appId, envName, callback) {
  this._authGet("/apps/" + appId + "/envs/" + envName, function (err, json) {
    if(err) return callback(err);

    callback(null, json.env);
  });
};

exports.listEnvUsers = function (appId, envName, callback) {
  this._authGet("/apps/" + appId + "/envs/" + envName + "/users", function (err, json) {
    if(err) return callback(err);

    callback(null, json.users);
  });
};

exports.inviteToEnv = function (appId, envName, email, callback) {
  this._authPost("/apps/" + appId + "/envs/" + envName + "/users", { email: email }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.user);
  });
};

exports.updateEnv = function (appId, envName, data, callback) {
  if(!data || !Object.keys(data).length) {
    return callback(new Error("At least one variable must be set to update the environment."));
  }

  this._authPost("/apps/" + appId + "/envs/" + envName, data, function (err, json) {
    if(err) return callback(err);

    callback(null, json.env);
  });
};

exports.set = function (appId, envName, key, value, callback) {
  var data = {};
  data[key] = value;

  this.updateEnv(appId, envName, data, callback);
};
