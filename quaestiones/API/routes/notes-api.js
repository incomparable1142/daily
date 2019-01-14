(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
	    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("note");
    var assignmentHelper = require(process.cwd() + '\\common\\mongo_base')("lecturer_exam");

    var noteHelper = {};

	 noteHelper.create = function (req, res) {
		var note = {
						assignment: req.body.assignment,
						title : req.body.title,
						description : req.body.description,
						reference_text : req.body.reference_text,
						type : req.body.type,
						number_of_pages : req.body.number_of_pages,
						notes : req.body.notes,
						size : req.body.size,
						downloaded : req.body.downloaded,
                        publication_date : new Date(),
                        last_updated_date : new Date(),
                        created_by : ""
					};
		if(req.headers.authorization){
			note.created_by = req.body.created_by;
		}
		mongoHelper.create(note)
			.then(function(response){
			    return res.send({ success: 'true' });
			}, function(res){
				return res.status(400).send(err);
			});    
	};

    noteHelper.getall = function (req, res) {
        mongoHelper.getall()
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    noteHelper.get_by_id = function (req, res) {
         mongoHelper.get_by_id(req.params.id)
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
	};

	noteHelper.get_by_fk = function (req, res) {
        mongoHelper.get_by_fkid(req.params.name , req.params.id)
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    noteHelper.get_countby_fk = function (req, res) {
        mongoHelper.get_by_fkid(req.params.name , req.params.id)
            .then(function (response) {
                var result = JSON.parse(response).length;
                return res.send({assignment_id: req.params.id, count : result});
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    noteHelper.get_by_email = function (req, res){
          var obj = {"created_by": req.params.email}

             mongoHelper.get_by_multiplefk(obj)
              .then(function (response) {
                return res.send(response);
              }, function (res) {
                return res.status(400).send(err);
          });
    };

    noteHelper.update = function (req, res) {
          var newvalues = {
                            assignment: req.body.assignment,
                            title : req.body.title,
                            description : req.body.description,
                            reference_text : req.body.reference_text,
                            type : req.body.type,
                            number_of_pages : req.body.number_of_pages,
                            notes : req.body.notes,
                            downloaded : req.body.downloaded,
                            publication_date : new Date(),
                            last_updated_date : new Date()
                          };
          mongoHelper.update(req.params.id , newvalues)
			.then(function(response){
			    return res.send({ success: 'true' });
			}, function(res){
				return res.status(400).send(err);
			});
    };

    noteHelper.upload = function (req, res) {
        var filePath = req.protocol + '://' + req.headers.host + '/notes/' + req.file.filename;

        var newvalue = {
                        notes: filePath,
                        last_updated_date : new Date()
                      };

        mongoHelper.update(req.params.id , newvalue)
            .then(function(response){
                return res.send(filePath);
            }, function(res){
                return res.status(400).send(err);
            });

    };
	
	noteHelper.createurl = function (req, res) {
        var filePath = req.protocol + '://' + req.headers.host + '/notes/' + req.file.filename;
        return res.send(filePath);
    };

    noteHelper.search_by_name = function (req, res) {
         var name = "title";
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

     noteHelper.getlatest = function (req, res) {
        var field = "publication_date";
        var assignment = [];
        mongoHelper.getLatest(field)
			.then(function(response){
			  if (response == null || response == '' || response == undefined){
                 return res.send({ error: "Not Found" });
              }
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
                        return res.send({ notes: result, assignment: JSON.parse(response) });
                    }
                }, function (res) {
                    return res.status(400).send(err);
              });
			}, function(res){
				return res.status(400).send(err);
			});
     };

     noteHelper.search_by_name_limit = function (req, res) {
         var name = "title";
         var assignment = [];
         var searchLimit = parseInt(req.params.n);
	     mongoHelper.searchLimit(name, req.params.name,searchLimit)
	       .then(function(response) {
	          if (response == null || response == '' || response == undefined)
              {
                 return res.send({ error: "Not Found" });
              }
	          var result = response;
			  for(var i = 0;i < result.length; i++){
                  if(result[i]["assignment"]){
                      assignment.push(new mongo.ObjectID(result[i]["assignment"]))
                  }
              }
              var assignmentFilter = { "_id": {$in: assignment }}
              assignmentHelper.get_by_multiplefk(assignmentFilter)
                .then(function (response) {
                    if(response.length > 0){
                        return res.send({ notes: result, assignment: JSON.parse(response) });
                    }
                }, function (res) {
                    return res.status(400).send(err);
              });
		   }, function(err){
	           return res.send({ error: err });
		   });
	 };

	 noteHelper.getdownloaded = function (req, res) {
        var field = "downloaded";
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
                        return res.send({ notes: result, assignment: JSON.parse(response) });
                    }
                }, function (res) {
                    return res.status(400).send(err);
              });
			}, function(res){
				return res.status(400).send(err);
			});
     };

     noteHelper.get_by_assignments = function (req, res) {
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

     noteHelper.getlatestbyfac = function (req, res) {
         var assignment = [];
         var field = "publication_date";
         var obj = {"faculty": req.params.id}
         assignmentHelper.get_by_multiplefk(obj)
         .then(function (response) {
             var result = JSON.parse(response);
             for(var i = 0;i < result.length; i++){
                  if(result[i]["_id"]){
                      assignment.push(result[i]["_id"])
                  }
             }
             var noteFilter = { "assignment": {$in: assignment }}
             mongoHelper.get_latest(noteFilter,field)
                .then(function(response){
                  if(response.length > 0){
                        return res.send({ assignment: result, notes: JSON.parse(response) });
                  }
                }, function (res) {
                    return res.status(400).send(err);
                });
         }, function(res){
				return res.status(400).send(err);
		 });
     };

     noteHelper.get_note_by_assignment = function(req, res){
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
            var notesFilter = { "assignment": {$in: assignment }}
            mongoHelper.get_count(notesFilter)
            .then(function(response){
               if(response.length > 0){
                 return res.send({ assignment: result, notes: JSON.parse(response)});
               }
            }, function (res) {
                return res.status(400).send(err);
            });
         }, function (res) {
             return res.status(400).send(err);
         });
    }

    module.exports = noteHelper;

})();

