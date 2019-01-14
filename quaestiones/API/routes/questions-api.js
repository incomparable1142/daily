(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("question");
    var commentsHelper = require(process.cwd() + '\\common\\mongo_base')("comment");
    var assignmentHelper = require(process.cwd() + '\\common\\mongo_base')("lecturer_exam");

    var questionHelper = {};

	questionHelper.create = function (req, res) {
		var question = {
		                    assignment: req.body.assignment,
                            question : req.body.question,
                            comment : req.body.comment,
                            type : req.body.type,
                            created_date : new Date(),
                            last_updated_date : new Date(),
                            created_by : req.body.created_by
					   };
		
		if(req.headers.authorization){
			question.created_by = req.user.email;
		}
		mongoHelper.create(question)
			.then(function(response){
			    return res.send({ success: 'true' });
			}, function(res){
				return res.status(400).send(err);
			});
    };

    questionHelper.getall = function (req, res) {
        mongoHelper.getall()
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

//    questionHelper.getlatest = function (req, res) {
//        mongoHelper.getLatest()
//			.then(function(response){
//			    return res.send(response);
//			}, function(res){
//				return res.status(400).send(err);
//			});
//    };

    questionHelper.get_by_id = function (req, res) {
         mongoHelper.get_by_id(req.params.id)
			.then(function(response){
			    return res.send(response);
			}, function(err){
				return res.status(400).send(err);
			});
    };

    questionHelper.get_by_email = function (req, res){
          var obj = {"created_by": req.params.email}
          var assignment_ids = [];
             mongoHelper.get_by_multiplefk(obj)
              .then(function (response) {
                var result = JSON.parse(response);
                for(var i = 0;i < result.length; i++){
                    if(result[i]["assignment"]){
                        assignment_ids.push(new mongo.ObjectID(result[i]["assignment"]))
                    }
                }
                var filter = {"_id": {$in : assignment_ids}}
                assignmentHelper.get_by_multiplefk(filter)
                  .then(function(response){
                      var assignments = JSON.parse(response);
                      return res.send({ assignments: assignments, questions: result });
                  }, function (res) {
                    return res.send({ error: "true" });
                });
              }, function (res) {
                return res.status(400).send(err);
          });
    };

    questionHelper.update = function (req, res) {
          var newvalues = {
                              assignment: req.body.assignment,
                              question: req.body.question,
                              comment : req.body.comment,
                              type: req.body.type,
                              created_date: new Date(),
                              last_updated_date: new Date(),
                              created_by: req.body.created_by
                        };

          mongoHelper.update(req.params.id , newvalues)
			.then(function(response){
			    return res.send({ success : 'true'});
			}, function(err){
				return res.status(400).send(err);
			});
    };

    questionHelper.get_by_multiplefk = function (req, res) {
         mongoHelper.get_by_multiplefk(req.body)
			.then(function(response){
			    return res.send(response);
			}, function(err){
				return res.status(400).send(err);
			});
    };

    questionHelper.delete_question = function (req, res) {
        mongoHelper.deleteOne(req.params.id)
			.then(function(response){
                if (response == 1){
                    return res.send({ success : 'Removed Successfully'});
                }else{
                    return res.send({ error : 'Unauthorized Request'});
                }
			}, function(res){
				return res.status(400).send(err);
			});
    };

    questionHelper.get_by_fk = function (req, res) {
        mongoHelper.get_by_fkid(req.params.name, req.params.id)
            .then(function (response) {
                var result = JSON.parse(response).length;
                return res.send({assignment_id: req.params.id, count : result, questions: response});
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    questionHelper.get_question_comments_byfk = function (req, res) {
        var comments = [];
        mongoHelper.get_by_fkid("assignment", req.params.id)
            .then(function (response) {
                var result = JSON.parse(response);
                for(var i = 0;i < result.length; i++){
                    if(result[i]["comment"]){
                        comments.push(new mongo.ObjectID(result[i]["comment"]))
                    }
                }
                var commentFilter = { "_id": {$in: comments }}
                var fields = {"assistant": 1, "comment": 1}
                commentsHelper.get_spec_bymultiplefk(commentFilter, fields)
                    .then(function(response){
                        return res.send({ questions : result, comments: JSON.parse(response) });
                    }, function (res) {
                        return res.send({ error: "Please try again later"});
                    });
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    questionHelper.search_by_name = function (req, res) {
         var name = "question";
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

    questionHelper.search_by_name_limit = function (req, res) {
        var name = "question";
        var searchLimit = parseInt(req.params.n);
		   mongoHelper.searchLimit(name, req.params.name,searchLimit)
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

    questionHelper.getlatest = function (req, res) {
        var field = "created_date";
        var assignment = [];
        mongoHelper.getLatest(field)
			.then(function(response){
			   var result = JSON.parse(response);
			   for(var i = 0;i < result.length; i++){
                  if(result[i]["assignment"]){
                      assignment.push(new mongo.ObjectID(result[i]["assignment"]))
                  }
               }
               var assignmentFilter = { "_id": {$in: assignment }}
			   assignmentHelper.get_by_multiplefk(assignmentFilter)
                .then(function (response) {
                    if(response.length > 0){
                        return res.send({ questions: result, assignment: JSON.parse(response) });
                    }
                }, function (res) {
                    return res.status(400).send(err);
                });
			}, function(res){
				return res.status(400).send(err);
			});
    };

    questionHelper.getmaxques_exam = function (req, res) {
         var assignment = [];
         mongoHelper.getMaxQuestion()
			.then(function(response){
			   var result = JSON.parse(response);
			   for(var i = 0;i < result.length; i++){
                  if(result[i]["_id"]){
                      assignment.push(new mongo.ObjectID(result[i]["_id"]))
                  }
               }
               var assignmentFilter = { "_id": {$in: assignment }}
               var fields = {"faculty_title": 1, "exam_name": 1,"university_name": 1,"faculty":1, "university": 1}

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

    questionHelper.get_by_assignments = function (req, res) {
         var query = {'assignment': {'$in' : req.body}}
            mongoHelper.get_by_multiplefk(query)
                .then(function (response) {
                    if(response.length > 0){
                        return res.send(response);
                    }
                }, function (res) {
                    return res.status(400).send(err);
            });
    };

    questionHelper.getlatestbyfac = function (req, res){
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
             var questionFilter = { "assignment": {$in: assignment }}
             mongoHelper.get_latest(questionFilter,field)
                .then(function(response){
                  if(response.length > 0){
                        return res.send({ assignment: result, questions: JSON.parse(response) });
                  }
                }, function (res) {
                    return res.status(400).send(err);
                });
         }, function(res){
				return res.status(400).send(err);
		 });
    }

    questionHelper.get_ques_by_assignment = function(req, res){
        var assignment = [];
        var obj = { "university": req.params.univid, "faculty": req.params.facid };

        assignmentHelper.get_by_multiplefk(obj)
         .then(function (response) {
            var result = JSON.parse(response);
            for(var i = 0;i < result.length; i++){
              if(result[i]["_id"]){
                 assignment.push(result[i]["_id"])
              }
            }
            var questionFilter = { "assignment": {$in: assignment }}
            mongoHelper.get_count(questionFilter)
            .then(function(response){
               if(response.length > 0){
                 return res.send({ assignment: result, questions: JSON.parse(response)});
               }
            }, function (res) {
                return res.status(400).send(err);
            });
         }, function (res) {
             return res.status(400).send(err);
         });
    }

    module.exports = questionHelper;

})();

