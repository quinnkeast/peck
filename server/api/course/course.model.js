'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CourseSchema = new Schema({
	name: String,
	authorID: { type: Schema.Types.ObjectId, ref: 'User' },
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', CourseSchema);