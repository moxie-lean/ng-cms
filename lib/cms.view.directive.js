angular
  .module('lnCms')
  .directive('lnCmsView', lnCmsView);

lnCmsView.$inject = ['$state', 'lnCmsClientService'];

function lnCmsView($state, lnCmsClientService) {

  return {
    restrict: 'E',
    link: link,
    template: '<div class="{{viewClass}}" ui-view></div>',
    scope: {
      viewDef: '@',
      staticDef: '@',
      viewClass: '@',
      enableLoadingState: '<'
    }
  };

  function link(scope) {
    scope.static = null;
    scope.view = null;

    lnCmsClientService.enableLoadingState = scope.enableLoadingState;

    scope.$watch('staticDef', onStaticChange);
    scope.$watch('viewDef', onViewChange);

    function onStaticChange() {
      if (scope.staticDef && scope.staticDef.trim() === '') {
        scope.static = angular.fromJson(scope.staticDef);
      }
    }

    function onViewChange() {
      if (scope.viewDef && scope.viewDef.trim() === '') {
        scope.view = angular.fromJson(scope.viewDef);
      }
    }
  }
}
