(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("user-request");
    var friendHelper = require(process.cwd() + '\\common\\mongo_base')("user-friend");

    var requestsHelper = {};

    requestsHelper.create = function (req, res) {
		var request = {
						user_id : req.body.user_id,
						friend_id : req.body.friend_id,
						confirmed: req.body.confirmed,
						seen: req.body.seen,
						last_updated_date : new Date(),
						created_date : new Date()
					  };

        mongoHelper.create(request)
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    requestsHelper.get_by_multiplefk = function (req, res) {
        var obj = { "user_id": { $in : [req.params.userid, req.params.friendid]} , "friend_id": { $in : [req.params.userid, req.params.friendid]} };

        mongoHelper.get_by_multiplefk(obj)
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    requestsHelper.delete_friend = function (req, res) {
        mongoHelper.deleteOne(req.params.id)
            .then(function (response) {
                if (response == 1){
                    return res.send({ success : 'Removed Successfully'});
                }else{
                    return res.send({ error : 'Unauthorized Request'});
                }
            }, function (err) {
                return res.status(400).send(err);
            });
    };

    requestsHelper.get_requests = function (req, res) {
        var obj = {"friend_id": req.params.friendid, "confirmed": false}

            mongoHelper.get_by_multiplefk(obj)
            .then(function (response) {
                return res.send(response);
            }, function (err) {
                return res.status(400).send(err);
            });
    };

    requestsHelper.update = function (req, res) {
          var newvalues = {
                            user_id : req.body.user_id,
                            friend_id : req.body.friend_id,
                            confirmed: req.body.confirmed,
                            seen: req.body.seen,
                            last_updated_date : new Date()
                          };
          var friend = [{
                            user_id : req.body.user_id,
                            friend_id : req.body.friend_id,
                            last_updated_date : new Date(),
                            created_date : new Date()
                          },
                          {
                            user_id : req.body.friend_id,
                            friend_id : req.body.user_id,
                            last_updated_date : new Date(),
                            created_date : new Date()
                        }];

          mongoHelper.update(req.params.id , newvalues)
			.then(function (response) {
                friendHelper.createmany(friend)
                .then(function (response) {
                    return res.send({ success: 'true' });
                }, function (res) {
                    return res.status(400).send(err);
                });
			}, function (res) {
			    return res.status(400).send(err);
			});
    };


    module.exports = requestsHelper;

})();
