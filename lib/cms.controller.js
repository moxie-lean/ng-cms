require('./cms.client.service');

angular
  .module('lnCms')
  .controller('LnCmsController', lnCmsController);

lnCmsController.$inject = ['$rootScope', 'lnCmsClientService', '$state', '$window'];

function lnCmsController($rootScope, lnCmsClientService, $state, $window) {
  var vm = this;

  vm.static = null;
  vm.view = null;

  //load static data
  lnCmsClientService
    .getStatic()
    .then(function success(response) {
      vm.static = response.data;
    }, onError);

  $rootScope.$on('$stateChangeStart', stateChangeStart);
  $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);
  $rootScope.$on('$stateChangeError', stateChangeError);

  function onError() {
    $state.go('503');
  }

  function stateChangeStart(event, toState, toParams, fromState, fromParams, options) {
    if (toState.url === '/' && toState.name !== 'default') {
      //go directly to default state instead of passing through an intermediate home state
      event.preventDefault();
      $state.go('default');
    } else if (fromState.name === 'loading' && toState.name === 'loading') {
      //view data was completely loaded and the state reload was triggered by the directive
      //go to the next state that we had stored before going to the loading state
      event.preventDefault();
      $state.go(lnCmsClientService.nextState.name, lnCmsClientService.nextParams);
    } else if (fromState.name !== 'loading' && toState.name !== 'loading') {
      //normal state change
      //if enableLoadingState is true, we store the next state and params and go to the loading state
      //while the view data is fetched from the backend
      var jsonToParams = toParams ? angular.toJson(toParams) : '';
      var jsonFromParams = fromParams ? angular.toJson(fromParams) : '';

      if (toState.data && (toState.name != fromState.name || jsonToParams != jsonFromParams)) {
        var endpoint = toState.data.endpoint;
        var fixedParams = toState.data.fixedParams;
        var request = toState.data.request;
        var params = {};
        
        //reset view to clean data before the request.
        if (vm.view) {
          vm.view = null;
        }

        //load view
        if (request || !vm.static) {
          if (lnCmsClientService.enableLoadingState) {
            event.preventDefault();
            lnCmsClientService.nextState = toState;
            lnCmsClientService.nextParams = toParams;
          }

          if (request) {
            //load fixed parameters
            for (var key in fixedParams) {
              if (fixedParams.hasOwnProperty(key))
                params[key] = fixedParams[key];
            }

            //load url parameters
            for (var key in toParams) {
              if (toParams.hasOwnProperty(key) ) {
                params[key] = toParams[key];
              }
            }
          
            lnCmsClientService
              .getData(endpoint, params)
              .then(function success(response) {
                vm.view = response.data;

                if ( angular.isArray( vm.view ) && angular.isDefined( vm.view[0].meta ) ) {
                  vm.meta = vm.view[0].meta;
                } else if ( angular.isDefined( vm.view.meta ) ) {
                  vm.meta = vm.view.meta;
                }
              }, onError);
          }

          if (lnCmsClientService.enableLoadingState) {
            $state.go('loading');
          }
        }
      }
    }
  }

  function stateChangeSuccess() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    if ( $window.ga ) {
      $window.ga( 'send', 'pageview', { page: getCurrentAbsoluteUrl() } );
    }
  }

  function stateChangeError() {
    $state.go('404');
  }

  function getCurrentAbsoluteUrl() {
    return $state.href( $state.current.name, $state.params, { absolute: true } );
  }
}
