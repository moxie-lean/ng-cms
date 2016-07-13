angular
  .module('lnCms')
  .directive('lnCmsView', lnCmsView);

function lnCmsView() {
  return {
    restrict: 'E',
    template: '<div class="{{viewClass}}" ui-view></div>',
    scope: {
      viewClass: '@',
    }
  };
}

