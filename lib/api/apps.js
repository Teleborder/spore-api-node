module.exports = Apps;

function Apps(api){
  this.api = api;
}

Apps.prototype.list = function (callback) {
  this.api.authGet(this.api.path('apps'), function (err, json) {
    if(err) return callback(err);

    callback(null, json.apps);
  });
};

Apps.prototype.get = function (appId, callback) {
  this.api.authGet(this.api.path('app', { appId: appId }), function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  });
};

Apps.prototype.create = function (id, appJson, callback) {
  var data = {
    id: id,
    name: appJson.name
  };

  this.api.authDelayPost(this.api.path('apps'), { data: data }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  });
};

Apps.prototype.changeOwner = function (appId, email, callback) {
  var data = {
    email: email
  };

  this.api.authPatch(this.api.path('app', { appId: appId }), { data: data }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  });
};

Apps.prototype.changeName = function (appId, name, callback) {
  var data = {
    name: name
  };

  this.api.authDelayPatch(this.api.path('app', { appId: appId }), { data: data }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  }); 
};
