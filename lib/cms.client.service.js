require('./cms.config.provider');

angular
  .module('lnCms')
  .factory('lnCmsClientService', lnCmsService);

lnCmsService.$inject = ['$http', 'lnCmsConfig', '$log'];

function lnCmsService($http, lnCmsConfig, $log) {

  return {
    getRoutes: getRoutes,
    getStatic: getStatic,
    getData: getData
  };

  function getRoutes() {
    return getData( lnCmsConfig.endpoints.routes );
  }

  function getStatic() {
    return getData( lnCmsConfig.endpoints.static );
  }

  function getData(endpoint, params) {
    if ( angular.isObject( params) && 1 === Object.keys(params).length && angular.isDefined( params.id ) ) {
      return $http.get( endpoint + '/' + params.id );
    }

    return $http.get( endpoint, {params: params} );
  }
}
