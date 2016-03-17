var angular = require('angular');

require('./client.service');

angular
  .module('lnCms')
  .controller('LnCmsController', lnCmsController);

lnCmsController.$inject = ['$scope', '$location', 'lnCmsClientService'];

function lnCmsController($scope, $location, lnCmsClientService) {
  var vm = this;

  vm.static = null;

  vm.view = null;

  lnCmsClientService.getStatic()
    .then(function(response) {
      vm.static = response.data;
    });

  $scope.$on('$locationChangeStart', loadView);

  function loadView() {
    const slug = $location.path();

    lnCmsClientService.getView(slug)
      .then(function(response) {
        if (response.data.length > 0) {
          vm.view = response.data[0];
          vm.view.templateUrl = `templates/${vm.view.template}/template.html`;
        }
      });
  }
}
