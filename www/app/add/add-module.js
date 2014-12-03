angular.module('remindr.add', ['ui.router'])
  .config(function($stateProvider) {
    $stateProvider
      .state('add', {
        url: "/add",
        views: {
          'tab-account': {
            templateUrl: 'app/add/add.html',
            controller: 'AddCtrl'
          }
        }
      })
  });
