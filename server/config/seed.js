/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var mongoose = require('mongoose');
var	Question = require('../api/question/question.model');
var	Quiz = require('../api/quiz/quiz.model');
var	User = require('../api/user/user.model');
var Course = require('../api/course/course.model');

Question.find({}).remove(function() {
	Question.create({
		"_id": mongoose.Types.ObjectId('111111111111111111111111'),
		"current": {
			"version": 1,
			"created": "2012-04-23T18:55:30.511Z",
			"content": "In what areas of the world are people less likely to be concerned with ego needs?",
			"answer": {
				"_id": mongoose.Types.ObjectId(),
				"text": "Haiti"
			},
			"otherAnswers": [{
				"_id": mongoose.Types.ObjectId(),
				"text": "Sweden"
			}, {
				"_id": mongoose.Types.ObjectId(),
				"text": "Switzerland"
			}, {
				"_id": mongoose.Types.ObjectId(),
				"text": "New Orleans"
			}],
		},
		"authorID": mongoose.Types.ObjectId('111111111111111111111111'),
		"public": false,
		"updated": "2012-04-23T18:55:30.511Z"
	}, {
		"_id": mongoose.Types.ObjectId('222222222222222222222222'),
		"current": {
			"version": 1,
			"created": "2012-04-23T18:55:30.511Z",
			"content": "Which of the following tag-lines for getting tetanus shots would be the the most effective?",
			"answer": {
				"_id": mongoose.Types.ObjectId(),
				"text": "Tetanus is deadly, so get the shot!"
			},
			"otherAnswers": [{
					"_id": mongoose.Types.ObjectId(),
					"text": "Get the shot!"
				}, {
					"_id": mongoose.Types.ObjectId(),
					"text": "Tetanus can be deadly."
				}, {
					"_id": mongoose.Types.ObjectId(),
					"text": "They would all be equally effective."
			}],
		},
		"authorID": mongoose.Types.ObjectId('111111111111111111111111'),
		"public": true,
		"updated": "2012-04-23T18:55:30.511Z"
	}, {
		"_id": mongoose.Types.ObjectId('333333333333333333333333'),
		"current": {
			"version": 2,		
			"created": "2012-04-23T18:55:30.511Z",
			"content": "When asked if he likes fruit, Jon says no. This is an example of a(n):",
			"answer": {
				"_id": mongoose.Types.ObjectId(),
				"text": "Explicit attitude"
			},
			"otherAnswers": [{
					"_id": mongoose.Types.ObjectId(),
					"text": "Self-concept"
				}, {
					"_id": mongoose.Types.ObjectId(),
					"text": "Affect"
				}, {
					"_id": mongoose.Types.ObjectId(),
					"text": "Subjective norm"
			}],
		},
		"previous": [{
			"version": 1,
			"created": "2012-04-23T18:55:30.511Z",
			"content": "When asked if he likes fruit, Jon says yes. This is an example of a(n):",
			"answer": {
				"_id": mongoose.Types.ObjectId(),
				"text": "Implicit attitude"
			},
			"otherAnswers": [{
					"_id": mongoose.Types.ObjectId(),
					"text": "Self-concept"
				}, {
					"_id": mongoose.Types.ObjectId(),
					"text": "Affect"
				}, {
					"_id": mongoose.Types.ObjectId(),
					"text": "Subjective norm"
			}],
		}],
		"authorID": mongoose.Types.ObjectId('111111111111111111111111'),
		"public": false,
		"updated": "2012-04-23T18:55:30.511Z"
	}, function() {
		console.log('finished populating questions');
	}
	);
});

Quiz.find({}).remove(function() {
	Quiz.create({
		"_id": mongoose.Types.ObjectId('111111111111111111111111'),
        "title": "Consumer behaviour final exam",
        "submissions": [{
            "userID": mongoose.Types.ObjectId('111111111111111111111111'),
            "date": "2012-04-23T18:25:43.511Z",
            "score": 14,
            "numberOfQuestions": 15,
            "percentage": .93,
        }, {
            "userID": mongoose.Types.ObjectId('111111111111111111111111'),
            "date": "2012-04-23T18:55:30.511Z",
            "score": 14,
            "numberOfQuestions": 15,
            "percentage": .93,
        }],
        "questions": [
        	mongoose.Types.ObjectId('111111111111111111111111'),
	        mongoose.Types.ObjectId('222222222222222222222222')
        ],
        "course": "Consumer Behaviour",
        "authorID": mongoose.Types.ObjectId('111111111111111111111111'),
        "public": false,
        "updated": "2012-04-23T18:55:30.511Z"
    }, {
	    "_id": mongoose.Types.ObjectId('222222222222222222222222'),
        "title": "Social psych final exam",
        "submissions": [{
            "userID": mongoose.Types.ObjectId('111111111111111111111111'),
            "date": "2012-04-23T18:25:43.511Z",
            "score": 14,
            "numberOfQuestions": 15,
            "percentage": .93,
        }, {
            "userID": mongoose.Types.ObjectId('111111111111111111111111'),
            "date": "2012-04-23T18:55:30.511Z",
            "score": 14,
            "numberOfQuestions": 15,
            "percentage": 93,
        }],
        "course": "Social Psychology",
        "authorID": mongoose.Types.ObjectId('111111111111111111111111'),
        "public": false,
        "updated": "2012-04-23T18:55:30.511Z"
    }, function() {
		console.log('finished populating quizzes');
	}
	);
});

User.find({}).remove(function() {
	User.create({
		"_id": mongoose.Types.ObjectId('111111111111111111111111'),
		"provider": 'local',
		"name": 'Test User',
		"email": 'test@test.com',
		"password": 'test'
	}, {
		"_id": mongoose.Types.ObjectId('222222222222222222222222'),
		"provider": 'local',
		"role": 'admin',
		"name": 'Admin',
		"email": 'admin@admin.com',
		"password": 'admin'
	}, function() {
		console.log('finished populating users');
	}
	);
});

Course.find({}).remove(function() {
	Course.create({
		"_id": mongoose.Types.ObjectId('111111111111111111111111'),
		"name": "Consumer Behaviour",
		"authorID": mongoose.Types.ObjectId('111111111111111111111111'),
	}, {
		"_id": mongoose.Types.ObjectId('222222222222222222222222'),
		"name": "Social Psych",
		"authorID": mongoose.Types.ObjectId('222222222222222222222222'),
	}
	);
});