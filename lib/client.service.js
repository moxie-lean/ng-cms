'use strict';

angular
  .module('lnCms')
  .factory('lnCmsClientService', lnCmsService);

lnCmsService.$inject = ['$http', 'apiBase'];

function lnCmsService($http, apiBase) {
  var API_BASE = apiBase;

  return {
    getView: getView,
    getStatic: getStatic
  };

  function getView(slug) {
    var args = {
      params: {
        slug: slug ? slug : '/'
      }
    };

    return $http.get(API_BASE + 'post', args);
  }

  function getStatic() {
    return $http.get(API_BASE + 'static');
  }
}
