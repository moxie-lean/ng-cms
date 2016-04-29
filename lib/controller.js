'use strict';

require('./client.service');

angular
  .module('lnCms')
  .controller('LnCmsController', lnCmsController);

lnCmsController.$inject = ['$rootScope', '$scope', 'lnCmsClientService', '$urlRouter', '$state'];

function lnCmsController($rootScope, $scope, lnCmsClientService, $urlRouter, $state) {
  var vm = this;

  vm.static = null;
  vm.view = null;

  $rootScope.$on('$stateChangeStart', stateChangeStart);
  function stateChangeStart(event, toState, toParams, fromState, fromParams, options){
    var jsonToParams = toParams ? angular.toJson(toParams) : '';
    var jsonFromParams = fromParams ? angular.toJson(fromParams) : '';

    if (toState.name != fromState.name || jsonToParams != jsonFromParams) {
      var endpoint = toState.data.endpoint;
      var fixedParams = toState.data.fixedParams;
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

      // Reset view to have duplicated data before the request.
      vm.view = [];
      //load view
      if ( toState.data.request ) {
        lnCmsClientService
        .getView(endpoint, params)
        .then(function(response) {
          if (response.data.length > 0) {
            vm.view = response.data[0];
          } else if (response.data) {
            vm.view = response.data;
          }
        }, onError);
      }
    }
  }

  $rootScope.$on('$stateChangeSuccess', resetScroll);
  function resetScroll() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }


  $rootScope.$on('$locationChangeSuccess', locationChangeSucess);
  function locationChangeSucess(event) {
    event.preventDefault();
    //load static
    loadStatic($urlRouter.sync);
  }

  function loadStatic(cb) {
    if ( vm.static ) {
      cb();
    } else {
      lnCmsClientService
      .getStatic()
      .then(function(response) {
        vm.static = response.data;
        cb();
      }, onError);
    }
  }

  function onError(response){
    if ( response.status === 404 ) {
      $state.go('404');
    }
  }
}
