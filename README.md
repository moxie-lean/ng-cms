# Leean CMS

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

Listens for route changes and sends a message to the CMS for data each time. It also loads routes and static data once when the app loads. It expects API endpoints terminating in /post, /static and /routes for this.

LnCms uses [AngularUI Router](https://github.com/angular-ui/ui-router) to define the available routes and their corresponding states. The module loads the configuration data to define the routes from the /routes backend endpoint, which expects an output like the following:

```javascript
[
  {
    "state": "home",
    "url": "/",
    "template": "home"
  },
  {
    "state": "allPhotos",
    "url": "/photos",
    "template": "allPhotos"
  },
  {
    "state": "authorPhotos",
    "url": "/photos/:authorId",
    "template": "authorPhotos"
  },
  {
    "state": "photo",
    "url": "/photos/:authorId/:photoId",
    "template": "photo"
  }
]
```

Each of the routes will try to load its corresponding template from paths like this: ```templates/<route-template>/template.html```. Examples: 

templates/**home**/template.html  
templates/**allPhotos**/template.html  
templates/**authorPhotos**/template.html  
templates/**photo**/template.html  

To link to the different states you have to use ```ui-sref``` directive from AngularUI Router. Here are some examples:

```html
<!-- link to home page -->
<a ui-sref="home">

<!-- link to all photos page -->
<a ui-sref="allPhotos">

<!-- link to Juan's photos page -->
<a ui-sref="authorPhotos({authorId: \"juan\"})">

<!-- link to Everest photo page from Juan -->
<a ui-sref="photo({authorId: \"juan\", photoId: \"everest\"})">
```

### ln-cms-view Directive

Includes the corresponding template using the ```ui-view``` directive from AngularUI Router and passes the view and static data to sub-directives. Each time the view data changes due to a change of the current route, the directive reloads the current state.

In order to load the view data from the backend, LnCms uses the /post endpoint which must receive the state as parameter, and optionally the extra parameters needed to search for the corresponding view data. Here are some examples:

```javascript
// GET /post?state=home
[
  {
    "post_id": 1,
    "state": "home",
    "content": { ... },
    "meta": { ... }
  }
]

// GET /post?state=authorPhotos&authorId=juan
[
  {
    "post_id": 2,
    "state": "authorPhotos",
    "authorId": "juan",
    "content": { ... },
    "meta": { ... }
  }
]

// GET /post?state=photo&authorId=juan&photoId=everest
[
  {
    "post_id": 3,
    "state": "photo",
    "authorId": "juan",
    "photoId": "everest",
    "content": { ... },
    "meta": { ... }
  }
]
```

You can use the ```content``` object to inject the custom data of each page to your sub-directives.

### ln-cms-meta Directive

(not yet complete) Updates the meta information.
