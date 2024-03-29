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
    $scope.coursesVisible = true;
    $scope.filters = {};
    $scope.order = 'updated';
    $scope.sort = { 
		by: 'updated', 
		reverse: true 
	};
        
    $scope.toggleSort = function(value) {
		if ($scope.sort.by === value){
			$scope.sort.reverse = !$scope.sort.reverse;
		}
		$scope.sort.by = value;
	};

    // Get some data
    $scope.loadQuizzes();
    
    $scope.showCourses = function() {
	    $scope.coursesVisible = true;
    };

    $scope.hideCourses = function() {
	    $scope.coursesVisible = false;
    };
        
    // Create a new quiz
	$scope.createQuiz = function () {
		
		// Open a modal using a new controller
	    var modalInstance = $modal.open({
			templateUrl: 'app/main/quizzes/new/newQuiz.html',
			controller: 'NewQuizCtrl',
			resolve: {
				existingCourses: function(Course) {
					return Course.query().$promise;
				}
			}
	    });
		
	    modalInstance.result.then(function () {
			// Do something now that it's open
		}, function () {
			//$log.info('Modal dismissed at: ' + new Date());
		});
		
	};
	
	$scope.quizSelectedForBulkAction = function(quiz) {
		
		// If it isn't already selected for bulk action, select it.
		if (!quiz.isSelectedForBulkAction) {
			bulkQuizzesSelected.addQuiz(quiz._id);
			quiz.isSelectedForBulkAction = true;
			
		// Otherwise, deselect it and remove it from bulkQuizzesSelected.	
		} else {
			bulkQuizzesSelected.removeQuiz(quiz._id);
			quiz.isSelectedForBulkAction = false;
		}
	};
	
	$scope.deselectQuizForBulkAction = function(quiz) {
		if (quiz.isSelectedForBulkAction === true) {
			bulkQuizzesSelected.removeQuiz(quiz._id);
			quiz.isSelectedForBulkAction = false;
		}
	};
	
	$scope.selectQuizForBulkAction = function(quiz) {
		if (quiz.isSelectedForBulkAction === false || !quiz.isSelectedForBulkAction) {
			bulkQuizzesSelected.addQuiz(quiz._id);
			quiz.isSelectedForBulkAction = true;
		}
	};
	
	// Check or uncheck all quizzes. Depends on areAllQuizzesChecked(group)
	// to determine if it should be checking all, or unchecking all.
	$scope.selectAllQuizzesForBulkAction = function(source) {
		var newValue = !$scope.areAllQuizzesChecked(source);
		
		_.each(source, function(quiz) {
			// If all quizzes are already selected, uncheck them all.
			if (!newValue === true) {
				$scope.deselectQuizForBulkAction(quiz);
			// Check them all.
			} else {
				// Only add to bulk actions if it isn't already there.
				if (!quiz.isSelectedForBulkAction) {
					$scope.selectQuizForBulkAction(quiz);
				}
			}
		});	
	};
  
	// Returns true if and only if all quizzes are selected.
	$scope.areAllQuizzesChecked = function(source) {
		var areAllQuizzesChecked = _.reduce(source, function(result, quiz) {
			return result + (quiz.isSelectedForBulkAction ? 1 : 0);
		}, 0);
				
		return (areAllQuizzesChecked === source.length);
	};

    $scope.startTest = function(quizID) {
	    
	    $state.go("activeQuiz", {id: quizID});
	    
    };
	    
	$scope.takeQuizzesInBulk = function() {
		
		var quizIDs = bulkQuizzesSelected.getQuizzes();
	    $state.go("activeQuiz", {id: quizIDs}); 
	    
	};
	
	$scope.numberOfQuizzesSelected = function() {
		return bulkQuizzesSelected.currentLength();
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
			if (quizList.length !== 0) {
				return quizList.length;
			} else {
				return false;
			}
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