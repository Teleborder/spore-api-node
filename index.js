var api = require('./lib/api'),
    Users = require('./lib/api/users'),
    Apps = require('./lib/api/apps'),
    Memberships = require('./lib/api/memberships'),
    Cells = require('./lib/api/cells');

module.exports = Spore;

function Spore(options) {
  options = options || {};
  this.hostname = options.hostname || "pod.spore.sh";
  this.protocol = options.protocol || "https";
  this.port = options.port || this.defaultPortFor(this.protocol) || 3000;
  this.key = options.key || null;
  this.email = options.email || null;
  this._hooks = [];

  this.users = new Users(this);
  this.apps = new Apps(this);
  this.memberships = new Memberships(this);
  this.cells = new Memberships(this);
}

Spore.prototype.setCredentials = function (email, key) {
  this.key = key;
  this.email = email;

  return this;
};

// add hooks for when callbacks return
Spore.prototype.use = function (hook) {
  this._hooks.push(hook);
};

for(var methodName in api) {
  Spore.prototype[methodName] = api[methodName];
}
