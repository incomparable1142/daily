(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("user_education");

    var userEducationHelper = {};

	userEducationHelper.create = function (req, res) {
		var userRole = {
                        userid : req.body.userid,
                        school : req.body.school,
                        degree : req.body.degree,
                        field_of_study : req.body.field_of_study,
                        grade : req.body.grade,
						created_date : new Date(),
						last_updated_date : new Date(),
						created_by : req.body.created_by
                    };

		mongoHelper.create(userRole)
			.then(function(response){
			    return res.send({ success: 'true' });
			}, function(res){
				return res.status(400).send(err);
			});
    };

    userEducationHelper.getall = function (req, res) {
        mongoHelper.getall()
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    userEducationHelper.get_by_id = function (req, res) {
         mongoHelper.get_by_id(req.params.id)
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };
	
	userEducationHelper.get_by_multiplefk = function (req, res) {

        var obj = {"userid": req.params.id}

        mongoHelper.get_by_multiplefk(obj)
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    userEducationHelper.update = function (req, res) {
          var newvalues = {
						userid : req.body.userid,
                        school : req.body.school,
                        degree : req.body.degree,
                        field_of_study : req.body.field_of_study,
                        grade : req.body.grade,
						created_date : new Date(),
						last_updated_date : new Date(),
						created_by : req.body.created_by
                          };

          mongoHelper.update(req.params.id , newvalues)
			.then(function(response){
			    return res.send({ success: 'true' });
			}, function(res){
				return res.status(400).send(err);
			});
    };

    module.exports = userEducationHelper;

})();

