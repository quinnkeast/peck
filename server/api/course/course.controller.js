'use strict';

var _ = require('lodash');
var Quiz = require('../quiz/quiz.model');

// Get list of unique courses for a user
exports.findForUser = function(req, res) {
	Quiz.find({"authorID": req.user._id})
		.distinct("course", function (err, courses) {
			if(err) { return handleError(res, err); }
			if(!courses) { return res.send(404); }
			return res.json(200, courses);
	});
};

function handleError(res, err) {
  return res.send(500, err);
}