'use strict';

angular
  .module('lnCms')
  .directive('lnCmsMeta', lnCmsMeta);

function lnCmsMeta() {

  return {
    restrict: 'A',
    link: link,
    scope: {
      lnCmsMeta: '@'
    }
  };

  function link(scope, element, attrs) {
    attrs.$observe('lnCmsMeta', function(value){
      if (value && value.trim() != '') {
        var meta = angular.fromJson(value);

        if (meta) {
          //remove old title and tags
          var oldTitle = element[0].querySelector('title'); 
          var oldTags = element[0].querySelectorAll('meta[class="ln-cms"]'); 

          if (oldTitle)
            angular.element(oldTitle).remove();

          angular.forEach(oldTags, function(oldTag) {
            angular.element(oldTag).remove();
          });

          //load new title and tags
          if (meta.title)
            element.append('<title>' + meta.title + '</title>');

          if (meta.tags) {
            angular.forEach(meta.tags, function(tag) {
              var att = '';

              angular.forEach(tag, function(val, key) {
                att += ' ' + key + '="' + val + '"';
              });

              if (att != '')
                element.append('<meta' + att + ' class="ln-cms">');
            });
          }
        }
      }
    });
  }
}
