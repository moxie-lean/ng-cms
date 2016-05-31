angular
  .module('lnCms')
  .provider('lnCmsConfig', lnCmsConfig);

/**
 * Expects: {
 *    "endpoints": {
 *       "routes": "http://example.com/wp-json/lean/v2/routes",
 *       "static": "http://example.com/wp-json/lean/v2/static"
 *    }
 * }
 */

function lnCmsConfig() {
  var self = this;
  var config;

  self.$get = [function () {
    return angular.copy(config);
  }];

  self.setConfig = function (data) {
    config = data;
  };
}
