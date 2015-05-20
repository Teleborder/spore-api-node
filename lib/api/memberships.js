module.exports = Memberships;

function Memberships(api) {
  this.api = api;
}

Memberships.prototype.list = function (appId, envName, callback) {
  this.api.authGet(this.api.path('memberships', { appId: appId, envName: envName }), function (err, json) {
    if(err) return callback(err);

    callback(null, json.memberships);
  });
};

Memberships.prototype.grant = function (appId, envName, email, callback) {
  var data = {
    email: email
  };

  this.api.authPost(this.api.path('memberships', { appId: appId, envName: envName }), { data: data }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.membership);
  });
};

Memberships.prototype.accept = function (token, callback) {
  var api = this.api;

  this.api.get(this.api.path('invite', { token: token }), function (err, inviteJson) {
    if(err) return callback(err);

    if(!inviteJson.valid) {
      return callback(new Error("Invalid invite"));
    }

    var data = {
      token: token
    };

    api.authPatch(
      api.path('membership', { appId: inviteJson.app, envName: inviteJson.environment, email: inviteJson.email }),
      { data: data },
      function (err, membershipJson) {
        if(err) return callback(err);

        callback(null, membershipJson, inviteJson);
      }
    );
  });
};

Memberships.prototype.revoke = function (appId, envName, email, callback) {
  this.api.authDelete(this.api.path('membership', { appId: appId, envName: envName, email: email }), function (err, json) {
    if(err) return callback(err);

    callback(null, json.membership);
  });
};
