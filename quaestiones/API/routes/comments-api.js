(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("comment");
    var assignmentHelper = require(process.cwd() + '\\common\\mongo_base')("lecturer_exam");

    var commentHelper = {};

	commentHelper.create = function (req, res) {
		var comment = {
                            assignment: req.body.assignment,
                            comment : req.body.comment,
                            assistant : req.body.assistant,
                            vote : req.body.vote,
                            date : req.body.date,
                            email : req.body.email,
                            show_email : req.body.show_email,
                            created_date : new Date(),
                            last_updated_date : new Date(),
                            created_by : req.body.created_by
					   };
        if(req.headers.authorization){
			comment.created_by = req.user.email;
		}
		mongoHelper.create(comment)
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    commentHelper.getall = function (req, res) {
        mongoHelper.getall()
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    commentHelper.get_by_id = function (req, res) {
         mongoHelper.get_by_id(req.params.id)
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    commentHelper.update = function (req, res) {
          var newvalues = {
                            assignment: req.body.assignment,
                            comment : req.body.comment,
                            email : req.body.email,
                            show_email : req.body.show_email,
                            last_updated_date : new Date()
                        };

          mongoHelper.update(req.params.id , newvalues)
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    commentHelper.deletecomment = function (req, res) {
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


    commentHelper.get_by_fk = function (req, res) {
        mongoHelper.get_by_fkid(req.params.name, req.params.id)
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    commentHelper.get_by_email = function (req, res) {
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
                      return res.send({ assignments: assignments, comments: result });
                  }, function (res) {
                      return res.send({ error: "true" });
                  });
              }, function (res) {
                return res.status(400).send(err);
          });
    };

    commentHelper.getlatest = function (req, res) {
        var field = "created_date";
        mongoHelper.getLatest(field)
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    module.exports = commentHelper;

})();

