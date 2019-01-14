(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("suggestion");

    var suggestionHelper = {};

	suggestionHelper.create = function (req, res) {
		var suggestion = {
		                    lecturer : req.body.lecturer,
		                    exam : req.body.exam,
		                    faculty : req.body.faculty,
                            university : req.body.university,
                            appearance : req.body.appearance,
                            teacher_advice : req.body.teacher_advice,
                            like_as_a_teacher : req.body.like_as_a_teacher,
                            show_user_id : req.body.show_user_id,
                            created_date : new Date(),
                            last_updated_date : new Date(),
                            created_by : req.body.created_by
					   };

		mongoHelper.create(suggestion)
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    suggestionHelper.getall = function (req, res) {
        mongoHelper.getall()
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    suggestionHelper.get_by_id = function (req, res) {
         mongoHelper.get_by_id(req.params.id)
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    suggestionHelper.update = function (req, res) {
          var newvalues = {
                            lecturer : req.body.lecturer,
		                    exam : req.body.exam,
		                    faculty : req.body.faculty,
                            university : req.body.university,
                            appearance : req.body.appearance,
                            teacher_advice : req.body.teacher_advice,
                            like_as_a_teacher : req.body.like_as_a_teacher,
                            show_user_id : req.body.show_user_id,
                            created_date : new Date(),
                            last_updated_date : new Date(),
                            created_by : req.body.created_by
                        };

          mongoHelper.update(req.params.id , newvalues)
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    module.exports = suggestionHelper;

})();

