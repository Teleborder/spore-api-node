var api = require('./lib/api');

module.exports = Envy;

function Envy(options) {
  options = options || {};
  this.host = options.host || "envy.dev";
  this.port = options.port || 3000;
  this.protocol = options.protocol || "http";
  this.key = options.key || null;
}

// Administrative Methods (Public)

Envy.prototype.setKey = function (key) {
  this.key = key;

  return this;
};

// API Methods (Public)

for(var methodName in api) {
  Envy.prototype[methodName] = api[methodName];
}

