'use strict';

angular.module('peckApp')
  .controller('TestbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Quizzes',
      'link': '/main'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });