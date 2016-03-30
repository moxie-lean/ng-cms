# Lean CMS

> An AngularJS module for loading content from a CMS.


## Getting Started

The easiest way to install this package is by using npm from your terminal:

```
npm install ln-cms --save-dev
```


# Usage

First you need to create an ```ngConstants``` module with the apiBase. For example:
 
```
angular.module('ngConstants', [])
 .constant('apiBase', 'http://localhost:3000/');
```

Then you need to add the CMS module as a dependency to your app:
 
 ```
angular
    .module('app', [
        'lnCms'
    ]);
```

The module provides a controller which loads data form your CMS as the route changes. It makes that data available to various directives. A basic outline for you html is:
 
 ```html
 <!DOCTYPE html>
<html lang="en" ng-app="app" ng-controller="LnCmsController as vm">
 <head>
 
  <ln-cms-meta meta-def="{{vm.view.meta}}"></ln-cms-meta>
   
 </head>
 <body>
 
   <ln-cms-view view-def="{{vm.view}}" static-def="{{vm.static}}"></ln-cms-view>
  
 </body>
 </html>
```

### LnCmsController

Listens for route changes and sends a message to the CMS for data each time. It also loads static data once when the app loads. It expects API endpoint terminating in /post and /static for this.

It looks for a template named after the data type returned from the API.

### ln-cms-view Directive

Compiles the template and passes the view and static data on to sub-directives.

### ln-cms-meta Directive

(not yet complete) Updates the meta information.
