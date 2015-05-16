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

Apps.prototype.create = function (id, appJson, callback) {
  this.api.authPost(this.api.path('apps'), { id: id, name: appJson.name }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  });
};

Apps.prototype.changeOwner = function (appId, email, callback) {
  this.api.authPost(this.api.path('app', { appId: appId }), { email: email }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  });
};

Apps.prototype.changeName = function (appId, name, callback) {
  this.api.authPost(this.api.path('app', { appId: appId }), { name: name }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.app);
  }); 
};
