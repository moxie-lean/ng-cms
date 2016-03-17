'use strict';

module.exports = function link(scope) {
  scope.model = angular.fromJson(scope.modelDef);
};
