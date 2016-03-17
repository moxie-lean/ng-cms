var angular = require('angular');

angular
  .module('lnCms')
  .directive('lnCmsView', lnCmsView);

lnCmsView.$inject = ['$compile', '$templateCache'];

function lnCmsView($compile, $templateCache) {

  return {
    restrict: 'E',
    link: link,
    scope: {
      viewDef: '@',
      staticDef: '@'
    }
  };

  function link(scope, element) {

    const staticWatcher = scope.$watch('staticDef', onStaticChange);

    function onStaticChange() {
      if (!scope.staticDef) {
        return;
      }

      scope.static = angular.fromJson(scope.staticDef);

      staticWatcher();
    }

    scope.$watch('viewDef', onViewChange);

    function onViewChange() {
      if (!scope.viewDef) {
        return;
      }

      scope.view = angular.fromJson(scope.viewDef);

      element.html($templateCache.get(scope.view.templateUrl));

      $compile(element.contents())(scope);
    }
  }
}
