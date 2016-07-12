var lnCms = angular.module('lnCms', [
  require('angular-ui-router')
])

.config(['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider',
  function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
    lnCms.stateProvider = $stateProvider;

    //allow trailing slashes on routes
    $urlMatcherFactoryProvider.strictMode(false);

    //prevent $urlRouter from automatically intercepting URL changes
    $urlRouterProvider.deferIntercept();
    $urlRouterProvider.otherwise('/not-found');
  }
])

.run(['lnCmsClientService', '$urlRouter', '$state', '$q',
  function(lnCmsClientService, $urlRouter, $state, $q) {
    //add error state
    lnCms.stateProvider.state({
      name: '503',
      templateUrl: 'templates/error/template.html'
    });

    //add states defined in the routes endpoint
    lnCmsClientService.getRoutes()
      .then(function success(response) {
        var routes = response.data;

        angular.forEach(routes, function(route, key) {
          var state = {
            name: route.state,
            url: route.url,
            templateUrl: 'templates/' + route.template + '/template.html',
            controller: 'LnViewController as vm',
            resolve: {
              staticData:function(){
                return lnCmsClientService.getStatic();
              },
              viewData: function(){
                var endpoint = route.endpoint || 'post';
                var params = route.params || {};
                return lnCmsClientService.getData(endpoint, params);
              }
            },
            data: {
              endpoint: (route.endpoint || 'post'),
              fixedParams: (route.params || {}),
              request: 'request' in route ? route.request : true
            }
          };

          if (route.stateParams) {
            state.params = route.stateParams;
          }

          if (route.url == '/') {
            // //define default state for the empty url
            var defState = {};
            angular.copy(state, defState);
            defState.name = 'default';
            defState.url = '';
            lnCms.stateProvider.state(defState);
          } else if ( route.state === '404' ) {
            state.resolve.viewData = function() {
              return $q.when({});
            }
          }
          //add state for the route
          lnCms.stateProvider.state(state);
        });

        //enable $urlRouter listener again
        $urlRouter.listen();
        $urlRouter.sync();
      }, function error() {
        $state.go('503');
      });
  }
]);

require('./lib/cms.config.provider');
require('./lib/cms.client.service');
require('./lib/cms.controller');
require('./lib/cms-ln-view.controller');
require('./lib/cms.meta.directive');
require('./lib/cms.view.directive');
