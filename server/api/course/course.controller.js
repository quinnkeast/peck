'use strict';

var _ = require('lodash');
var Quiz = require('../quiz/quiz.model');

// Get list of unique courses for a user
exports.findForUser = function(req, res) {
	Quiz.find({"authorID": req.user._id})
		.distinct("course", function (err, courses) {
			if(err) { return handleError(res, err); }
			if(!courses) { return res.send(404); }
			
			var response = [];
			
			// Let's format this nicely so we can return an array
			// of objects.
			for (var i = 0, l = courses.length; i < l; i++) {
				response.push({
					"name": courses[i]
				});
			}
			
			return res.json(200, response);
	});
};

function handleError(res, err) {
  return res.send(500, err);
}