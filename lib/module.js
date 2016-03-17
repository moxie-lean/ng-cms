import angular from 'angular';

angular.module('lnCms', [
  'ngConstants'
]);

require('./client.service');
require('./controller');
require('./view.directive');
