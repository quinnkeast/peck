'use strict';

describe('Controller: ListQuizzesCtrl', function () {

  // load the controller's module
  beforeEach(module('peckApp'));

  var DashboardQuizzesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DashboardQuizzesCtrl = $controller('DashboardQuizzesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
