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
      var params = {};
      params.state = toState.name;

      for (var key in toParams) {
        if (toParams.hasOwnProperty(key))
          params[key] = toParams[key];
      }

      //load view
      lnCmsClientService.getView(params)
        .then(function(response) {
          if (response.data.length > 0)
            vm.view = response.data[0];
        });
    });

  $rootScope.$on('$locationChangeSuccess', function(event) {
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
