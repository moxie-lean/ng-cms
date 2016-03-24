'use strict';

require('./client.service');

angular
  .module('lnCms')
  .controller('LnCmsController', lnCmsController);

lnCmsController.$inject = ['$rootScope', '$scope', '$location', 'lnCmsClientService', '$urlRouter'];

function lnCmsController($rootScope, $scope, $location, lnCmsClientService, $urlRouter) {
  var vm = this;

  vm.static = null;
  vm.view = null;

  $rootScope.$on('$locationChangeSuccess', function(event) {
    //prevent state change
    event.preventDefault();

    //set loading slug
    var slug = $location.path();

    //load static
    loadStatic(function cb(){
      //load view
      lnCmsClientService.getView(slug)
        .then(function(response) {
          if (response.data.length > 0)
            vm.view = response.data[0];

          $urlRouter.sync();
        });
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
