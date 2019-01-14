(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("lecturer_exam");
    var commentHelper = require(process.cwd() + '\\common\\mongo_base')("comment");

    var lecturerExamHelper = {};

    lecturerExamHelper.create = function (req, res) {
        var lecturerExam = {
            exam: req.body.exam,
            lecturer: req.body.lecturer,
            faculty: req.body.faculty,
            university: req.body.university,
            exam_name: req.body.exam_name,
            lecturer_name: req.body.lecturer_name,
            faculty_title: req.body.faculty_title,
            university_name: req.body.university_name,
            created_date: new Date(),
            last_updated_date: new Date(),
            created_by: req.body.created_by
        };

        mongoHelper.create(lecturerExam)
            .then(function (response) {
                return res.send({ success: 'true' , result: response });
            }, function (err) {
                return res.status(400).send(err);
            });
    };

    lecturerExamHelper.getall = function (req, res) {
        mongoHelper.getall()
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    lecturerExamHelper.get_by_id = function (req, res) {
        mongoHelper.get_by_id(req.params.id)
           .then(function (response) {
               return res.send(response);
           }, function (res) {
               return res.status(400).send(err);
           });
    };

    lecturerExamHelper.get_by_fk = function (req, res) {
        mongoHelper.get_by_fkid(req.params.name, req.params.id)
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    lecturerExamHelper.update = function (req, res) {
        var newvalues = {
            exam: req.body.exam,
            lecturer: req.body.lecturer,
            faculty: req.body.faculty,
            university: req.body.university,
            exam_name: req.body.exam_name,
            lecturer_name: req.body.lecturer_name,
            faculty_title: req.body.faculty_title,
            university_name: req.body.university_name,
            created_date: new Date(),
            last_updated_date: new Date(),
            created_by: req.body.created_by
        };

        mongoHelper.update(req.params.id, newvalues)
          .then(function (response) {
              return res.send({ success: 'true' });
          }, function (res) {
              return res.status(400).send(err);
          });
    };

    lecturerExamHelper.delete_lecturerexam = function (req, res) {
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

    lecturerExamHelper.get_by_multiplefk = function (req, res) {
        var obj = { "university": req.params.univid, "faculty": req.params.facid };

        mongoHelper.get_by_multiplefk(obj)
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    lecturerExamHelper.get_comment_by_fk = function (req, res) {
        var obj = { "university": req.params.univid, "faculty": req.params.facid };
        var assignment_ids = [];

        mongoHelper.get_by_multiplefk(obj)
            .then(function (response) {
                var assignments = JSON.parse(response);
                for(var i = 0;i < assignments.length; i++){
                    assignment_ids.push(assignments[i]._id);
                }
                var query = {'assignment': {'$in' : assignment_ids}}
                commentHelper.get_by_multiplefk(query)
                    .then(function (response) {
                        if(response.length > 0){
                            return res.send(response);
                        }
                    }, function (res) {
                        return res.status(400).send(err);
                });
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    lecturerExamHelper.search_by_name = function (req, res) {
         var name = req.params.field;
         mongoHelper.search(name, req.params.name)
      	    .then(function(response) {
              if (response == null || response == '' || response == undefined)
              {
                  return res.send({ error: "Not Found" });
              }
    		  return res.send(response);
			}, function(err){
				return res.send({ error: err });
			});
    };

    lecturerExamHelper.search_by_multiple = function (req, res) {
         var filter = new RegExp(req.params.name, 'i');
         var query = [];
         query[0] = {"exam_name" : filter};
         query[1] = {"lecturer_name" : filter};

         mongoHelper.searchmultiple(query)
      	    .then(function(response) {
              if (response == null || response == '' || response == undefined)
              {
                  return res.send({ error: "Not Found" });
              }
    		  return res.send(response);
			}, function(err){
				return res.send({ error: err });
			});
    };

    module.exports = lecturerExamHelper;

})();

