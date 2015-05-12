var api = require('./lib/api');

module.exports = Spore;

function Spore(options) {
  options = options || {};
  this.host = options.host || "api.spore.sh";
  this.protocol = options.protocol || "https";
  this.port = options.port || this.defaultPortFor(this.protocol) || 3000;
  this.key = options.key || null;
}

// Administrative Methods (Public)

Spore.prototype.setKey = function (key) {
  this.key = key;

  return this;
};

// API Methods (Public)

for(var methodName in api) {
  Spore.prototype[methodName] = api[methodName];
}

