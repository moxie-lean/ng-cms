'use strict';

angular
  .module('lnCms')
  .factory('lnCmsClientService', lnCmsService);

lnCmsService.$inject = ['$http', 'apiBase'];

function lnCmsService($http, apiBase) {
  var API_BASE = apiBase;

  return {
    getRoutes: getRoutes,
    getView: getView,
    getStatic: getStatic,
    enableLoadingState: false,
    nextState: null,
    nextParams: null
  };

  function getRoutes() {
    return $http.get(API_BASE + 'routes');
  }

  function getView(endpoint, params) {
    return $http.get(API_BASE + endpoint, {params: params});
  }

  function getStatic() {
    return $http.get(API_BASE + 'static');
  }
}
