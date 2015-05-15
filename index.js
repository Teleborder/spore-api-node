var api = require('./lib/api');

module.exports = Spore;

function Spore(options) {
  options = options || {};
  this.hostname = options.hostname || "pod.spore.sh";
  this.protocol = options.protocol || "https";
  this.port = options.port || this.defaultPortFor(this.protocol) || 3000;
  this.key = options.key || null;
  this.email = options.email || null;
  this._hooks = [];
}

// Administrative Methods (Public)

Spore.prototype.setCredentials = function (email, key) {
  this.key = key;
  this.email = email;

  return this;
};

// add hooks for when callbacks return
Spore.prototype.use = function (hook) {
  this._hooks.push(hook);
};

// API Methods (Public)

for(var methodName in api) {
  Spore.prototype[methodName] = api[methodName];
}

