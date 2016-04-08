var lnCms = angular.module('lnCms', [
  'ngConstants', require('angular-ui-router')
])
.config(['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider',
  function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
    lnCms.stateProvider = $stateProvider;
    lnCms.urlRouterProvider = $urlRouterProvider;

    //allow trailing slashes on routes
    $urlMatcherFactoryProvider.strictMode(false);

    //prevent $urlRouter from automatically intercepting URL changes
    $urlRouterProvider.deferIntercept();
  }
])
.run(['lnCmsClientService', '$urlRouter',
  function(lnCmsClientService, $urlRouter) {
    lnCms.urlRouterProvider.otherwise('/');

    lnCmsClientService.getRoutes()
      .then(function(response) {
        var routes = response.data;

        angular.forEach(routes, function(route, key) {
          var state = {
            name: route.state,
            url: route.url,
            templateUrl: 'templates/' + route.template + '/template.html',
            data: {
              endpoint: (route.endpoint || 'post'),
              fixedParams: (route.params || {})
            }
          };

          lnCms.stateProvider.state(state);
        });
        //enable $urlRouter listener again
        $urlRouter.listen();
      });
  }
]);


require('./lib/client.service');
require('./lib/controller');
require('./lib/view.directive');
