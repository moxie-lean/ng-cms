require('./cms.config.provider');

angular
  .module('lnCms')
  .factory('lnCmsClientService', lnCmsService);

lnCmsService.$inject = ['$http', 'lnCmsConfig', '$document'];

function lnCmsService($http, lnCmsConfig, $document) {
  var doc = $document[0];
  return {
    getRoutes: getRoutes,
    getStatic: getStatic,
    getData: getData,
    hasLoader: _hasLoader,
  };

  function getRoutes() {
    return getData( lnCmsConfig.endpoints.routes );
  }

  function getStatic() {
    return getData( lnCmsConfig.endpoints.static );
  }

  function getData(endpoint, params) {
    var options = {
      cache: true,
    };

    if ( angular.isObject( params ) && 1 === Object.keys(params).length && angular.isDefined( params.id ) ) {
      return $http.get( endpoint + '/' + params.id,  options );
    } else {
      options.params = params;
      return $http.get( endpoint, options );
    }
  }

  function _hasLoader() {
    return doc.body.getAttribute('data-has-loader') === 'true';
  }
}
