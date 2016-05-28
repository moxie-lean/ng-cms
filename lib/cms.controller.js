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
    var jsonToParams = toParams ? angular.toJson(toParams) : '';
    var jsonFromParams = fromParams ? angular.toJson(fromParams) : '';

    if (toState.name != fromState.name || jsonToParams != jsonFromParams) {
      var endpoint = toState.data.endpoint;
      var fixedParams = toState.data.fixedParams;
      var request = toState.data.request;
      var params = {};

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

      // Reset view to clean data before the request.
      if (vm.view) {
        vm.view = null;
      }

      //load view
      if ( request ) {
        lnCmsClientService
        .getView(endpoint, params)
        .then(function(response) {
          if (response.data.length > 0) {
            vm.view = response.data[0];
          } else if (response.data) {
            vm.view = response.data;
          }
        });
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
