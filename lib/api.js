var apiSupport = require('./support'),
    cellPathParse = require('spore-cell-parse');

// Add our support methods
for(var methodName in apiSupport) {
  exports[methodName] = apiSupport[methodName];
}

exports.signup = function (email, password, callback) {
  var api = this;

  this._post(this.buildPath('users'), { email: email, password: password }, function (err, json) {
    if(err) return callback(err);

    var user = json.user;

    api.login(email, password, function (err, key) {
      if(err) return callback(err);

      user.key = key;

      callback(null, user);
    });
  });
};

exports.login = function (email, password, callback) {
  this._post(this.buildPath('keys', { email: email }), { password: password }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.key);
  });
};

exports.verify = function (token, callback) {
  this._patch(this.buildPath('user', { email: this.email }), { token: token }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.user);
  });
};

exports.listApps = function (callback) {
  this._authGet("/apps", function (err, json) {
    if(err) return callback(err);

    callback(null, json.apps);
  });
};

exports.createApp = function (id, appJson, callback) {
  this._authPost(this.buildPath('apps'), { id: id, name: appJson.name }, function (err, json) {
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

exports.changeAppName = function (appId, name, callback) {
  this._authPost(this.buildPath('app', { appId: appId }), { name: name }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  }); 
};

exports.memberships = function (appId, envName, callback) {
  this._authGet(this.buildPath('memberships', { appId: appId, envName: envName }), function (err, json) {
    if(err) return callback(err);

    callback(null, json.memberships);
  });
};

exports.grant = function (appId, envName, email, callback) {
  this._authPost(this.buildPath('memberships', { appId: appId, envName: envName }), { email: email }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.membership);
  });
};

exports.accept = function (token, callback) {
  var api = this;

  this._get(this.buildPath('invite', { token: token }), function (err, inviteJson) {
    if(err) return callback(err);

    if(!inviteJson.valid) {
      return callback(new Error("Invalid invite"));
    }

    api._authPatch(
      api.buildPath('membership', { appId: inviteJson.app, envName: inviteJson.environment, email: inviteJson.email }),
      { token: token },
      callback
    );
  });
};

exports.revoke = function (appId, envName, email, callback) {
  this._authDelete(this.buildPath('membership', { appId: appId, envName: envName, email: email }), function (err, json) {
    if(err) return callback(err);

    callback(null, json.membership);
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
