'use strict';

angular.module('peckApp')
	.directive('peckFocusMe', function($timeout) {
		return {
			scope: { trigger: '@focusMe' },
			link: function(scope, element) {
				scope.$watch('trigger', function(value) {
					if(value === "true") { 
						$timeout(function() {
						    element[0].focus(); 
						});
					}
				});
			}
		};
	});