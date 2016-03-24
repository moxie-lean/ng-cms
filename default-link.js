'use strict';

module.exports = function link(scope) {
  if (!scope.modelDef || scope.modelDef.trim() == '') {
    return;
  }

  scope.model = angular.fromJson(scope.modelDef);
};
