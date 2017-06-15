require('./cms.client.service');

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

    if ( angular.isArray(view) && view.length && angular.isDefined( view[0].meta ) ) {
      vm.meta = view[0].meta;
    } else if ( angular.isDefined( view.meta ) ) {
      vm.meta = view.meta;
    }
  });

  $rootScope.$on('$stateChangeStart', stateChangeStart);
  $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);
  $rootScope.$on('$stateChangeError', stateChangeError);

  function set404Status() {
    var status = document.createElement('meta');
    status.setAttribute( 'name', 'prerender-status-code' );
    status.setAttribute( 'content', '404' );
    document.head.appendChild(status);
  }

  function onError() {
    $state.go('503');
  }

  function stateChangeStart( event, toState ) {
    if ( toState.name === '503' || toState.name === '404' ) {
      set404Status();
    }
    vm.isLoading = lnCmsClientService.hasLoader();
  }

  function stateChangeSuccess() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if ( $window.ga ) {
      $window.ga( 'send', 'pageview', { page: getCurrentAbsoluteUrl() } );
    }
    if ( lnCmsClientService.hasLoader() ) {
      setTimeout( stopLoading, 16 );

      function stopLoading() {
        vm.isLoading = false;
      }
    }
  }

  function stateChangeError() {
    $state.go('404');
  }

  function getCurrentAbsoluteUrl() {
    return $state.href( $state.current.name, $state.params, { absolute: true } );
  }
}
