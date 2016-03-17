var angular = require('angular');

angular.module('lnCms', [
  'ngConstants'
]);

require('./lib/client.service');
require('./lib/controller');
require('./lib/view.directive');
