var angular = require('angular');

module.exports = function link(scope) {
  scope.model = angular.fromJson(scope.modelDef);
};
