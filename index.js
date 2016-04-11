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
    lnCms.urlRouterProvider.otherwise('/not-found');

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

          if (route.url == '/') {
            //define default state for the empty url
            var defState = JSON.parse(JSON.stringify(state));
            defState.name = 'default';
            defState.url = '';
            lnCms.stateProvider.state(defState);
          }

          //add state for the route
          lnCms.stateProvider.state(state);
        });

        //enable $urlRouter listener again
        $urlRouter.listen();
      });
  }
]);


require('./lib/client.service');
require('./lib/controller');
require('./lib/meta.directive');
require('./lib/view.directive');
