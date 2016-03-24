'use strict';

angular
  .module('lnCms')
  .directive('lnCmsView', lnCmsView);

lnCmsView.$inject = ['$state'];

function lnCmsView($state) {

  return {
    restrict: 'E',
    link: link,
    template: '<div ui-view view-def="{{viewDef}}" static-def="{{staticDef}}"></div>',
    scope: {
      viewDef: '@',
      staticDef: '@'
    }
  };

  function link(scope) {
    scope.static = null;
    scope.view = null;

    var staticWatcher = scope.$watch('staticDef', onStaticChange);

    function onStaticChange() {
      if (!scope.staticDef || scope.staticDef.trim() == '') {
        return;
      }

      scope.static = angular.fromJson(scope.staticDef);

      staticWatcher();
    }

    scope.$watch('viewDef', onViewChange);

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
