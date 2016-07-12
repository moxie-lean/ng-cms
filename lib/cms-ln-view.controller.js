angular
  .module('lnCms')
  .controller('LnViewController', lnViewController);

lnViewController.$inject = ['$rootScope', 'viewData', 'staticData'];

function lnViewController($rootScope, viewData, staticData) {
  var vm = this;
  vm.static = staticData.data;
  vm.view = viewData.data;
  $rootScope.$emit('staticDataUpdated', vm.view);
}
