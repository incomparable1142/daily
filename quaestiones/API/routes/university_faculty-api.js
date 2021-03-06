(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("university_faculty");

    var universityFacultyHelper = {};

	universityFacultyHelper.create = function (req, res) {
		var universityFaculty = {
                                    faculty : req.body.faculty,
                                    university : req.body.university,
                                    created_date : new Date(),
                                    last_updated_date : new Date(),
                                    created_by : req.body.created_by
                                };

		mongoHelper.create(universityFaculty)
			.then(function(response){
			    return res.send({ success: 'true' });
			}, function(res){
				return res.status(400).send(err);
			});
    };

    universityFacultyHelper.getall = function (req, res) {
        mongoHelper.getall()
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    universityFacultyHelper.get_by_id = function (req, res) {
         mongoHelper.get_by_id(req.params.id)
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    universityFacultyHelper.getfaculty = function (req, res) {
        var name = "university";
         mongoHelper.get_by_fkid(name, req.params.id)
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

	universityFacultyHelper.getuniversity = function (req, res) {
        var name = "faculty";
         mongoHelper.get_by_fkid(name, req.params.id)
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    universityFacultyHelper.update = function (req, res) {
          var newvalues = {
                            faculty : req.body.faculty,
                            university : req.body.university,
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

    universityFacultyHelper.delete_record = function (req, res) {
        mongoHelper.deleteOne(req.params.id)
			.then(function (response) {
			    if (response == 1) {
			        return res.send({ success: 'Removed Successfully' });
			    } else {
			        return res.send({ error: 'Unauthorized Request' });
			    }
			}, function (res) {
			    return res.status(400).send(err);
			});
    };

    module.exports = universityFacultyHelper;

})();

