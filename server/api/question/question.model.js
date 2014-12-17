'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var QuestionSchema = new Schema({
	current: {
		version: { type: Number, default: 1 },			
		created: { type: Date, default: Date.now },
		content: String,
		answer: { 
			_id: { 
				type: mongoose.Schema.ObjectId,
				default: mongoose.Types.ObjectId
			},
			text: String 
		},
		other_answers: [{ 
			text: String 
		}],
	},
	previous: [{
		version: Number,
		created: { type: Date },
		content: String,
		answer: { 
			_id: { 
				type: mongoose.Schema.ObjectId,
				default: mongoose.Types.ObjectId
			},
			text: String 
		},
		otherAnswers: [{ 
			text: String 
		}],
	}],
	author_id: { type: Schema.Types.ObjectId, ref: 'User' },
	updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', QuestionSchema);