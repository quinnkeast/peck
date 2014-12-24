'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var QuizSchema = new Schema({
	title: String,
	submissions: [{
		userID: { type: Schema.Types.ObjectId, ref: 'User' },
		date: { type: Date, default: Date.now },
		score: Number,
		numberOfQuestions: Number,
		percentage: Number,
		wronglyAnswered: [{
			"questionID": { type: Schema.Types.ObjectId, ref: 'Question' },
			"selectedAnswerID": { type: Schema.Types.ObjectId } 
		}]
	}],
	questions: [
		{ type: Schema.Types.ObjectId, ref: 'Question' }
	],
	course: { type: Schema.Types.ObjectId, ref: 'Course' },
	setID: [
		{ type: Schema.Types.ObjectId, ref: 'Set' }
	],
	authorID: { type: Schema.Types.ObjectId, ref: 'User' },
	isPublic: Boolean,
	updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);