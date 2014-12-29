'use strict';

angular.module('peckApp')
  .controller('ListQuizzesCtrl', function ($scope, $http, $modal, $q, Auth, Quiz, $state, $stateParams, bulkQuizzesSelected) {
	  
	// Sort the given collection on the given property.
    function sortOn(collection, name) {
        collection.sort(
            function(a, b) {
                if (a[name] <= b[name]) {
                    return(-1);
                }
                return(1);
            }
        );
    }

    // Group the quizzes list on the given property.
    // By default, this'll be by the course. However, this is set
    // up to give us the flexibility we need to change grouping
    // in the future.
    $scope.groupBy = function(attribute) {
				
        // First, reset the courses.
        $scope.groups = [];

        // Now, sort the collection of quizzes on the
        // grouping-property. This just makes it easier
        // to split the collection.
        sortOn($scope.quizzes, attribute);

        // I determine which group we are currently in.
        var groupValue = "_INVALID_GROUP_VALUE_";

        // As we loop over each friend, add it to the
        // current group - we'll create a NEW group every
        // time we come across a new attribute value.
        for (var i = 0 ; i < $scope.quizzes.length ; i++) {

            var quiz = $scope.quizzes[i];

            // Should we create a new group?
            if (quiz[attribute] !== groupValue) {

                var group = {
                    label: quiz.course,
                    quizzes: []
                };

                groupValue = group.label;

                $scope.groups.push(group);

            }
            
            // Add the friend to the currently active
            // grouping.
            group.quizzes.push(quiz);
        }
    };
    
    // Load the quiz list. This could be moved to the ui-router resolve,
    // should investigate the best option. TODO.
    $scope.loadQuizzes = function() {
	  	
	  	$scope.isLoading = true;
	  	
	  	var quizzes = Quiz.query().$promise.then(function(quizzes) {
		  	
		  	$scope.quizzes = quizzes;
		  	
		  	// Sort the quiz list
		  	$scope.groupBy('course', false);
		  	
		  	$scope.isLoading = false;
	  	});
	  	
    };
    
    // Here we go!
    $scope.isLoading = false;
    $scope.showCourses = true;
    $scope.numberOfQuizzesSelected = 0;
    bulkQuizzesSelected.reset();    
    
    // Get some data
    $scope.loadQuizzes();
    
    // Should we be grouping by course?
    $scope.toggleCourseVisibility = function() {
	    if ($scope.showCourses) {
		    $scope.showCourses = false;
	    } else {
		    $scope.showCourses = true;
	    }
    };
    
    // Create a new quiz
	$scope.createQuiz = function () {
		
		// Open a modal using a new controller
	    var modalInstance = $modal.open({
			templateUrl: 'app/main/quizzes/new/newQuiz.html',
			controller: 'NewQuizCtrl',
	    });
		
	    modalInstance.result.then(function () {
			// Do something now that it's open
		}, function () {
			//$log.info('Modal dismissed at: ' + new Date());
		});
		
	};
	
	// Triggered whenever a quiz is checked or unchecked.
	$scope.quizSelectedForBulkAction = function(quiz) {
		
		if (quiz.isSelectedForBulkAction) {
			
			bulkQuizzesSelected.addQuiz(quiz._id);
			
		} else {
			
			bulkQuizzesSelected.removeQuiz(quiz._id);
			quiz.isSelectedForBulkAction = false;
			
		}
	
		$scope.numberOfQuizzesSelected = bulkQuizzesSelected.currentLength();
	
	};

    $scope.startTest = function(quizID) {
	    
	    $state.go("activeQuiz", {id: quizID});
	    
    }
	    
	$scope.takeQuizzesInBulk = function() {
		
		var quizIDs = bulkQuizzesSelected.getQuizzes();
	    $state.go("activeQuiz", {id: quizIDs}); 
	    
	};
	
	}).service('bulkQuizzesSelected', function() {
		var quizList = [];
		
		var reset = function() {
			quizList = [];
		};
		
		var addQuiz = function(newObj) {
			quizList.push(newObj);
		};
		
		var removeQuiz = function(existingObj) {
			var position = quizList.indexOf(existingObj);
			if ( ~position ) quizList.splice(position, 1);
		};
		
		var getQuizzes = function(){
			return quizList;
		};
		
		var currentLength = function() {
			return quizList.length;
		}
		
		// Private functions
		function getIndexOf(arr, val, prop) {
			var l = arr.length,
			k = 0;
			for (k = 0; k < l; k = k + 1) {
				if (arr[k][prop] === val) {
					  return k;
				}
			}
			return false;
		}
		
		return {
			reset: reset,
			addQuiz: addQuiz,
			getQuizzes: getQuizzes,
			removeQuiz: removeQuiz,
			currentLength: currentLength
		};
	});