var apiSupport = require('./support'),
    cellPathParse = require('./utils/cell_path_parse');

// Add our support methods
for(var methodName in apiSupport) {
  exports[methodName] = apiSupport[methodName];
}

exports.signup = function (email, password, callback) {
  this._post(this.buildPath('users'), { email: email, password: password }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.user);
  });
};

exports.login = function (email, password, callback) {
  this._post(this.buildPath('keys', { email: email }), { password: password }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.keys);
  });
};

exports.listApps = function (callback) {
  this._authGet("/apps", function (err, json) {
    if(err) return callback(err);

    callback(null, json.apps);
  });
};

exports.createApp = function (name, callback) {
  this._authPost(this.buildPath('apps'), { name: name }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  });
};

exports.getApp = function (appId, callback) {
  this._authGet(this.buildPath('app', { appId: appId }), function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  });
};

exports.changeAppOwner = function (appId, email, callback) {
  this._authPost(this.buildPath('app', { appId: appId }), { email: email }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  });
};

exports.users = function (appId, envName, callback) {
  this._authGet(this.buildPath('envUsers', { appId: appId, envName: envName }), function (err, json) {
    if(err) return callback(err);

    callback(null, json.users);
  });
};

exports.grant = function (appId, envName, email, callback) {
  this._authPost(this.buildPath('envUsers', { appId: appId, envName: envName }), { email: email }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.user);
  });
};

exports.revoke = function (appId, envName, email, callback) {
  this._authDelete(this.buildPath('envUser', { appId: appId, envName: envName, email: email }), function (err, json) {
    if(err) return callback(err);

    callback(null, json.user);
  });
};

exports.createCell = function (cellPath, cellJson, callback) {
  var parsedPath = cellPathParse(cellPath),
      appId = parsedPath.app,
      envName = parsedPath.env;

  this._authPost(this.buildPath('cells', { appId: appId, envName: envName }), cellJson, function (err, json) {
    if(err) return callback(err);

    callback(null, json.cell);
  });
};

exports.getCell = function (cellPath, callback) {
  var parsedPath = cellPathParse(cellPath),
      appId = parsedPath.app,
      envName = parsedPath.env,
      cellId = parsedPath.cell;

  this._authGet(this.buildPath('cell', { appId: appId, envName: envName, cellId: cellId }), function (err, json) {
    if(err) return callback(err);

    callback(null, json.cell);
  });
};
