require('./cms.client.service');
var raf = require('raf')

angular
  .module('lnCms')
  .controller('LnCmsController', lnCmsController);

lnCmsController.$inject = ['$rootScope', 'lnCmsClientService', '$state', '$window'];
function lnCmsController($rootScope, lnCmsClientService, $state, $window) {
  var vm = this;
  vm.isLoading = lnCmsClientService.hasLoader();
  vm.meta = {};

  $rootScope.$on('staticDataUpdated', function(e, view) {
    if ( ! angular.isDefined( view ) ) {
      return;
    }

    if ( angular.isArray(view) && angular.isDefined( view[0].meta ) ) {
      vm.meta = view[0].meta;
    } else if ( angular.isDefined( view.meta ) ) {
      vm.meta = view.meta;
    }
  });

  $rootScope.$on('$stateChangeStart', stateChangeStart);
  $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);
  $rootScope.$on('$stateChangeError', stateChangeError);

  function onError() {
    $state.go('503');
  }

  function stateChangeStart(event, toState, toParams, fromState, fromParams, options) {
    vm.isLoading = lnCmsClientService.hasLoader();
  }

  function stateChangeSuccess() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if ( $window.ga ) {
      $window.ga( 'send', 'pageview', { page: getCurrentAbsoluteUrl() } );
    }
    if ( lnCmsClientService.hasLoader() ) {
      raf(function() {
        vm.isLoading = false;
      });
    }
  }

  function stateChangeError() {
    $state.go('404');
  }

  function getCurrentAbsoluteUrl() {
    return $state.href( $state.current.name, $state.params, { absolute: true } );
  }
}
