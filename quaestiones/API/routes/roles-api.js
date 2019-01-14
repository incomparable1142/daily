(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("role");

    var roleHelper = {};

	roleHelper.create = function (req, res) {
		var role = {
                        role : req.body.role.toLowerCase(),
                        created_date : new Date(),
                        last_updated_date : new Date(),
                        created_by : req.body.created_by
                    };

		var filterRole = { "role": role.role };
	    mongoHelper.get_by_multiplefk(filterRole)
			.then(function(response){
			    var roleData = JSON.parse(response);

			    if(roleData.length > 0 ){
			        return res.send({ error: 'Role Already Exists' });
			    } else{
			        mongoHelper.create(role)
			            .then(function(response){
			                return res.send({ success: 'true' });
			            }, function(res){
			                return res.status(400).send(err);
			            });
			    }
			}, function (res) {
			    return res.status(400).send(err);
			});
    };

    roleHelper.getall = function (req, res) {
        mongoHelper.getall()
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    roleHelper.get_by_id = function (req, res) {
         mongoHelper.get_by_id(req.params.id)
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    roleHelper.update = function (req, res) {
          var newvalues = {
                            role : req.body.role.toLowerCase(),
                            created_date : new Date(),
                            last_updated_date : new Date(),
                            created_by : req.body.created_by
                          };
          var filterRole = { "role": newvalues.role };
        mongoHelper.get_by_multiplefk(filterRole)
          .then(function(response){
              var roleData = JSON.parse(response);

              if (roleData.length > 0) {
                  return res.send({ error: 'Role Already Exists' });
              } else {

                  mongoHelper.update(req.params.id, newvalues)
			        .then(function (response) {
			            return res.send({ success: 'true' });
			        }, function (res) {
			            return res.status(400).send(err);
			        });
              }
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    roleHelper.delete_role = function (req, res) {
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

    module.exports = roleHelper;

})();

