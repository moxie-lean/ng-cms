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
      if (!scope.staticDef || scope.staticDef.trim() == '') {
        return;
      }

      scope.static = angular.fromJson(scope.staticDef);

      if (!$state.current.abstract) {
        reloadState();
      }
    }

    function onViewChange() {
      if (!scope.viewDef || scope.viewDef.trim() == '') {
        return;
      }

      scope.view = angular.fromJson(scope.viewDef);

      if (!$state.current.abstract) {
        reloadState();
      }
    }

    function reloadState() {
      var request = lnCmsClientService.nextState ? lnCmsClientService.nextState.data.request : false;

      if ((!request && scope.static) || (request && scope.static && scope.view)) {
        $state.reload();
      }
    }
  }
}
