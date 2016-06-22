'use strict';

require('./client.service');

angular
  .module('lnCms')
  .controller('LnCmsController', lnCmsController);

lnCmsController.$inject = ['$rootScope', '$scope', 'lnCmsClientService', '$urlRouter', '$state', '$window'];

function lnCmsController($rootScope, $scope, lnCmsClientService, $urlRouter, $state, $window) {
  var vm = this;

  vm.static = null;
  vm.view = null;
  vm.nextState = null;
  vm.nextParams = null;

  //load static data
  lnCmsClientService
    .getStatic()
    .then(function(response) {
      vm.static = response.data;
    });

  $rootScope.$on('$stateChangeStart', stateChangeStart);
  $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);
  $rootScope.$on('$stateChangeError', stateChangeError);

  function stateChangeStart(event, toState, toParams, fromState, fromParams, options){
    if (toState.url == '/' && toState.name != 'default') {
      event.preventDefault();
      $state.go('default');
    } else if (fromState.name == 'loading' && toState.name == 'loading') {
      event.preventDefault();
      $state.go(vm.nextState.name, vm.nextParams);
    } else if (fromState.name != 'loading' && toState.name != 'loading') {
      var jsonToParams = toParams ? angular.toJson(toParams) : '';
      var jsonFromParams = fromParams ? angular.toJson(fromParams) : '';

      if (toState.name != fromState.name || jsonToParams != jsonFromParams) {
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
          event.preventDefault();
          vm.nextState = toState;
          vm.nextParams = toParams;

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
            .getView(endpoint, params)
            .then(function success(response) {
              if (response.data.length > 0) {
                vm.view = response.data[0];
              } else if (response.data) {
                vm.view = response.data;
              }
            });
          }

          $state.go('loading');
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
