'use strict';

require('./client.service');

angular
  .module('lnCms')
  .controller('LnCmsController', lnCmsController);

lnCmsController.$inject = ['$rootScope', '$scope', 'lnCmsClientService', '$urlRouter'];

function lnCmsController($rootScope, $scope, lnCmsClientService, $urlRouter) {
  var vm = this;

  vm.static = null;
  vm.view = null;

  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams, options){
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
          if (toParams.hasOwnProperty(key))
            params[key] = toParams[key];
        }

        //load view
        lnCmsClientService.getView(endpoint, params)
          .then(function(response) {
            if (response.data.length > 0) {
              vm.view = response.data[0];
            } else if (response.data) {
              vm.view = response.data;
            }
          });
      }
    });

  $rootScope.$on('$locationChangeSuccess',
    function(event) {
      event.preventDefault();

      //load static
      loadStatic(function(){
        $urlRouter.sync();
      });
    });

  function loadStatic(cb) {
    if (!vm.static) {
      lnCmsClientService.getStatic()
        .then(function(response) {
          vm.static = response.data;
          cb();
        });
    }
    else
      cb();
  }
}
