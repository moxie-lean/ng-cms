'use strict';

angular
  .module('lnCms')
  .directive('lnCmsView', lnCmsView);

lnCmsView.$inject = ['$state'];

function lnCmsView($state) {

  return {
    restrict: 'E',
    link: link,
    template: '<div ui-view></div>',
    scope: {
      viewDef: '@',
      staticDef: '@'
    }
  };

  function link(scope) {
    scope.static = null;
    scope.view = null;

    scope.$watch('staticDef', onStaticChange);
    scope.$watch('viewDef', onViewChange);

    function onStaticChange() {
      if (!scope.staticDef || scope.staticDef.trim() == '') {
        return;
      }

      scope.static = angular.fromJson(scope.staticDef);
    }

    function onViewChange() {
      if (!scope.viewDef || scope.viewDef.trim() == '') {
        return;
      }
      
      scope.view = angular.fromJson(scope.viewDef);

      if (!$state.current.abstract)
        $state.reload();
    }
  }
}
