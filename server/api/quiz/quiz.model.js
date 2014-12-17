'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var QuizSchema = new Schema({
	title: String,
	submissions: [{
		user_id: { type: Schema.Types.ObjectId, ref: 'User' },
		date: { type: Date, default: Date.now },
		score: Number,
		numberOfQuestions: Number,
		percentage: Number,
		wrongAnswers: [ { type: Schema.Types.ObjectId, ref: 'Question' } ]
	}],
	questions: [
		{ type: Schema.Types.ObjectId, ref: 'Question' }
	],
	course_id: Number, /*{ type: Schema.Types.ObjectId, ref: 'Course' }*/
	set_id: [
		{ type: Schema.Types.ObjectId, ref: 'Set' }
	],
	author_id: { type: Schema.Types.ObjectId, ref: 'User' },
	isPublic: Boolean,
	updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);