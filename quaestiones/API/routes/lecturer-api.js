(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("lecturer");

    var lecturerHelper = {};

    lecturerHelper.create = function (req, res) {
        var lecturer = {
						firstname : req.body.firstname,
                        lastname : req.body.lastname,
                        name: req.body.firstname + " " + req.body.lastname,
                        created_date : new Date(),
                        last_updated_date : new Date(),
                        created_by : req.body.created_by
					   };
        mongoHelper.create(lecturer)
            .then(function (response) {
                return res.send({ success: 'true' , result: response });
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    lecturerHelper.getall = function (req, res) {
        mongoHelper.getall()
            .then(function (respose) {
                return res.send(respose);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    lecturerHelper.get_by_id = function (req, res) {
        mongoHelper.get_by_id(req.params.id)
            .then(function (respose) {
                return res.send(respose);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    lecturerHelper.update = function (req, res) {
		  var newvalues = {
                            firstname : req.body.firstname,
                            lastname : req.body.lastname,
                            name: req.body.firstname + " " + req.body.lastname,
                            created_date : new Date(),
                            last_updated_date : new Date(),
                            created_by : req.body.created_by
                          };
        mongoHelper.update(req.params.id, newvalues)
            .then(function (response) {
                return res.send({ success: 'true' });
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    lecturerHelper.delete_lecturer = function (req, res) {
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

    lecturerHelper.search_by_name = function (req, res) {
        var name = "name";
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

    lecturerHelper.search_by_name_limit = function (req, res) {
         var name = "name";
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

    module.exports = lecturerHelper;

})();

