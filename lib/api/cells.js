var cellPathParse = require('spore-cell-parse');

module.exports = Cells;

function Cells(api) {
  this.api = api;
}

Cells.prototype.create = function (cellPath, cellJson, callback) {
  var parsedPath = cellPathParse(cellPath),
      appId = parsedPath.app,
      envName = parsedPath.env;

  this.api.authDelayPost(this.api.path('cells', { appId: appId, envName: envName }), { data: cellJson }, function (err, json) {
    if(err) return callback(err);

    callback(null, json.cell);
  });
};

Cells.prototype.get = function (cellPath, callback) {
  var parsedPath = cellPathParse(cellPath),
      appId = parsedPath.app,
      envName = parsedPath.env,
      cellId = parsedPath.cell;

  this.api.authGet(this.api.path('cell', { appId: appId, envName: envName, cellId: cellId }), function (err, json) {
    if(err) return callback(err);

    callback(null, json.cell);
  });
};
