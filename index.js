var api = require('./lib/api'),
    Users = require('./lib/api/users'),
    Apps = require('./lib/api/apps'),
    Memberships = require('./lib/api/memberships'),
    Deployments = require('./lib/api/deployments'),
    Cells = require('./lib/api/cells');

module.exports = Spore;

function Spore(options) {
  options = options || {};
  this.hostname = options.hostname || "pod.spore.sh";
  this.protocol = options.protocol || "https";
  this.port = options.port || this.defaultPortFor(this.protocol) || 3000;
  this.key = options.key || null;
  this.email = options.email || null;
  this.name = options.name || null;
  this._hooks = [];

  this.users = new Users(this);
  this.apps = new Apps(this);
  this.memberships = new Memberships(this);
  this.deployments = new Deployments(this);
  this.cells = new Cells(this);
}

Spore.prototype.setCredentials = function (credentials) {
  this.key = credentials.key;

  // users have emails
  this.email = credentials.email;

  // deployments have names
  this.name = credentials.name;

  return this;
};

// add hooks for when callbacks return
Spore.prototype.use = function (hook) {
  this._hooks.push(hook);
};

for(var methodName in api) {
  Spore.prototype[methodName] = api[methodName];
}
