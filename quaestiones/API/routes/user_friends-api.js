(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");

    var friendsHelper = {};
    var userHelper = require(process.cwd() + '\\common\\mongo_base')("user");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("user-friend");

    friendsHelper.create = function (req, res) {
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

        mongoHelper.createmany(friend)
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    friendsHelper.get_by_multiplefk = function (req, res) {

        var obj = {"user_id": req.params.userid, "friend_id": req.params.friendid}

        mongoHelper.get_by_multiplefk(obj)
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    friendsHelper.delete_friend = function (req, res) {
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

    friendsHelper.get_requests = function (req, res) {
        var obj = {"friend_id": req.params.friendid, "confirmed": false}

            mongoHelper.get_by_multiplefk(obj)
            .then(function (response) {
                return res.send(response);
            }, function (err) {
                return res.status(400).send(err);
            });
    };

     friendsHelper.update = function (req, res) {
          var newvalues = {
                            user_id : req.body.user_id,
                            friend_id : req.body.friend_id,
                            last_updated_date : new Date()
                          };

          mongoHelper.update(req.params.id , newvalues)
			.then(function (response) {
			    return res.send({ success: 'true' });
			}, function (res) {
			    return res.status(400).send(err);
			});
    };

    friendsHelper.get_by_fk = function (req, res) {
        var filterUser = { "user_id": req.params.id }
        var users = [];
        mongoHelper.get_by_multiplefk(filterUser)
            .then(function (response) {
                var userfriend = JSON.parse(response);
                 if (userfriend.length < 1) {
                    return res.send({ error: "Something went wrong please try again later" });
                }
                for(var i = 0;i < userfriend.length; i++){
                   userHelper.get_by_id(userfriend[i].friend_id)
                    .then(function (response) {
                        users.push({"id": response._id, "username": response.username, "profilepic": response.profilepic});
                        if (users.length == userfriend.length){
                            return res.send({users: users, userfriend: userfriend});
                        }
                    }, function (res) {
                        return res.status(400).send(err);
                    });
                }
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    module.exports = friendsHelper;

})();
