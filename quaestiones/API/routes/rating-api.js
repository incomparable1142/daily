(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("rating");
    var userHelper = require(process.cwd() + '\\common\\mongo_base')("user");
    var assignmentHelper = require(process.cwd() + '\\common\\mongo_base')("lecturer_exam");

    var ratingHelper = {};

    ratingHelper.create = function (req, res) {
        var rating = {
						assignment: req.body.assignment,
						exposure_capacity : req.body.exposure_capacity,
						availability : req.body.availability,
						required_language : req.body.required_language,
						assistant_quality : req.body.assistant_quality,
						comment : req.body.comment,
                        created_date : new Date(),
                        last_updated_date : new Date(),
                        created_by : req.body.created_by
					 };


		if(!req.headers.authorization) {
		    return res.send({ error: "Something went wrong please try again later" });
		}

        rating.average_rating = (parseFloat(rating.exposure_capacity) + parseFloat(rating.availability) + parseFloat(rating.required_language) + parseFloat(rating.assistant_quality))/4
        rating.created_by = req.user.email;

        mongoHelper.create(rating)
            .then(function (response) {
                return res.send({ success : "true" });
            }, function (res) {
                return res.status(400).send({ error : "Something went wrong please try again later" });
            });
    };

    ratingHelper.get_by_id = function (req, res) {
        mongoHelper.get_by_id(req.params.id)
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    ratingHelper.update = function (req, res) {
          var newvalues = {
                            assignment: req.body.assignment,
                            exposure_capacity : req.body.exposure_capacity,
                            availability : req.body.availability,
                            required_language : req.body.required_language,
                            assistant_quality : req.body.assistant_quality,
                            comment : req.body.comment,
                            last_updated_date : new Date()
                          };
        newvalues.average_rating = (parseFloat(newvalues.exposure_capacity) + parseFloat(newvalues.availability) + parseFloat(newvalues.required_language) + parseFloat(newvalues.assistant_quality))/4
        mongoHelper.update(req.params.id, newvalues)
            .then(function (response) {
                return res.send({ success: "true" });
            }, function (res) {
                return res.status(400).send({ error: "true" });
            });
    };

    ratingHelper.get_avgby_fk = function (req, res) {
        var average_ratings = 0;
        var average = 0;
        mongoHelper.get_by_fkid(req.params.name , req.params.id)
            .then(function (response) {
                var result = JSON.parse(response);
                for(var i = 0;i < result.length; i++){
                    average_ratings += parseFloat(result[i]["average_rating"]);
                }
                if(!average_ratings == 0) {
                    average = Math.round(average_ratings/result.length*2)/2;
                }
                return res.send({ assignment_id: req.params.id, rating : average });
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    ratingHelper.get_avg = function (req, res) {
        var name = "assignment";
        var exposure_capacity_all = 0;
        var availability_all = 0;
        var required_language_all = 0;
        var assistant_quality_all = 0;

        var availability = 0;
        var exposure_capacity = 0;
        var required_language = 0;
        var assistant_quality = 0;

        var users = [];
        mongoHelper.get_by_fkid(name , req.params.id)
            .then(function (response) {

                var result = JSON.parse(response);
                for(var i = 0;i < result.length; i++){
                    exposure_capacity_all += parseFloat(result[i]["exposure_capacity"]);
                    availability_all += parseFloat(result[i]["availability"]);
                    required_language_all += parseFloat(result[i]["required_language"]);
                    assistant_quality_all += parseFloat(result[i]["assistant_quality"]);
                    users.push(result[i]["created_by"]);
                }

                exposure_capacity = Math.round(exposure_capacity_all/result.length*2)/2;
                availability = Math.round(availability_all/result.length*2)/2;
                required_language = Math.round(required_language_all/result.length*2)/2;
                assistant_quality = Math.round(assistant_quality_all/result.length*2)/2;

                var filterName = {"email": {$in: users}};
                var projection = {"name": 1, "profilepic": 1, "email": 1, "_id": 0};
                userHelper.get_spec_bymultiplefk(filterName, projection)
                .then(function(response){
                     if (!response) {
                        return res.send({ error: "Something went wrong please try again later" });
                     }

                    var usr = JSON.parse(response);
                    return res.send({ assignment_id: req.params.id, exposure_capacity: exposure_capacity,
                         availability: availability, required_language: required_language, users: usr,
                         assistant_quality: assistant_quality, comments: result });
                }, function (res) {
                    return res.status(400).send({ error : "Something went wrong please try again later" });
                });

            }, function (res) {
                return res.status(400).send(err);
            });
    };

    ratingHelper.get_by_fk = function (req, res) {
        if(!req.headers.authorization) {
            return res.send({ error: "Unauthorized access"});
        }
        var query = { "assignment" : req.params.id ,"created_by" : req.user.email }
        mongoHelper.get_by_multiplefk(query)
            .then(function (response) {
                return res.send({ success: "true", ratings: response});
            }, function (res) {
                return res.status(400).send({ error: "Unauthorized access"});
            });
    };

    ratingHelper.getlatest = function (req, res) {
        var field = "created_date";
        mongoHelper.getLatest(field)
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    ratingHelper.getrecent = function (req, res) {
        var assignment = [];
        mongoHelper.getLatestDistinct()
			.then(function(response){
			    var result = JSON.parse(response);
			    for(var i = 0;i < result.length; i++){
                    if(result[i]["_id"]){
                        assignment.push(new mongo.ObjectID(result[i]["_id"]))
                    }
                }
                var assignmentFilter = { "_id": {$in: assignment }}
                var fields = {"faculty_title": 1, "lecturer_name": 1,"university_name": 1, "university": 1, "faculty": 1}
			    assignmentHelper.get_spec_bymultiplefk(assignmentFilter, fields)
                    .then(function(response){
                        return res.send(response);
                    }, function (res) {
                        return res.send({ error: "Please try again later"});
                    });
			}, function(res){
				return res.status(400).send(err);
			});
    };

    ratingHelper.gettoprated = function (req, res) {
        var assignment = [];
        mongoHelper.getTopDistinct()
			.then(function(response){
			    var result = JSON.parse(response);
			    for(var i = 0;i < result.length; i++){
                    if(result[i]["_id"]){
                        assignment.push(new mongo.ObjectID(result[i]["_id"]))
                    }
                }
                var assignmentFilter = { "_id": {$in: assignment }}
                var fields = {"faculty_title": 1, "lecturer_name": 1,"university_name": 1 , "university": 1, "faculty": 1}
			    assignmentHelper.get_spec_bymultiplefk(assignmentFilter, fields)
                    .then(function(response){
                        return res.send(response);
                    }, function (res) {
                        return res.send({ error: "Please try again later"});
                    });
			}, function(res){
				return res.status(400).send(err);
			});
    };

    ratingHelper.getlatestbyfac = function (req, res) {
        var assignment = [];
        var field = "created_date";
        var obj = {"faculty": req.params.id}
        assignmentHelper.get_by_multiplefk(obj)
         .then(function (response) {
             var result = JSON.parse(response);
             for(var i = 0;i < result.length; i++){
                  if(result[i]["_id"]){
                      assignment.push(result[i]["_id"])
                  }
             }
             var ratingFilter = { "assignment": {$in: assignment }}
             mongoHelper.get_latest(ratingFilter,field)
                .then(function(response){
                  if(response.length > 0){
                        return res.send({ assignment: result, ratings: JSON.parse(response) });
                  }
                }, function (res) {
                    return res.status(400).send(err);
                });
         }, function(res){
				return res.status(400).send(err);
		 });
    };

    module.exports = ratingHelper;

})();

