angular
  .module('lnCms')
  .directive('lnCmsView', lnCmsView);

lnCmsView.$inject = ['$state', 'lnCmsClientService', '$rootScope'];

function lnCmsView($state, lnCmsClientService, $rootScope) {

  return {
    restrict: 'E',
    template: '<div class="{{viewClass}}" ui-view></div>',
    scope: {
      viewClass: '@',
    }
  };
}

