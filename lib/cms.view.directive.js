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

    scope.$watch('staticDef', _updateScope('staticDef', 'static'));
    scope.$watch('viewDef', _updateScope('viewDef', 'view'));

    function _updateScope(scopeKey, viewKey) {
      return function() {
        var data = scope[scopeKey]
        if ( data && data.trim() !== '') {
          scope[viewKey] = angular.fromJson(data);
        }
      }
    }
  }
}

