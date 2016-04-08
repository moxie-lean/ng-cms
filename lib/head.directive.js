'use strict';

angular
  .module('lnCms')
  .directive('lnCmsHead', lnCmsHead);

function lnCmsHead() {

  return {
    restrict: 'A',
    link: link,
    scope: {
      viewDef: '@'
    }
  };

  function link(scope, element, attrs) {
    scope.view = null;
    scope.$watch('viewDef', onViewChange);

    function onViewChange() {
      if (!scope.viewDef || scope.viewDef.trim() == '') {
        return;
      }
      
      scope.view = angular.fromJson(scope.viewDef);

      if (scope.view.head)
        element.html(scope.view.head);
      else
        element.html('');
    }
  }
}
