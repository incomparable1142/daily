(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");

    var noteCommentsHelper = {};
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("note-comments");
    var userHelper = require(process.cwd() + '\\common\\mongo_base')("user");

	noteCommentsHelper.create = function (req, res) {
		var comment = {
                            note: req.body.note,
                            user: req.body.user,
                            comment : req.body.comment,
                            created_date : new Date(),
                            last_updated_date : new Date(),
                            created_by : req.body.created_by
					   };
        if(!(comment.created_by)){
            return res.send({ error: "Something went wrong please try again later" });
        }
        var filterName = {"username": comment.created_by};
        userHelper.get_by_multiplefk(filterName)
            .then(function(response){
                 if (!response) {
                    return res.send({ error: "Something went wrong please try again later" });
                }
                var user = JSON.parse(response);
                comment.user = user[0]._id;
                mongoHelper.create(comment)
                    .then(function(response){
                        return res.send({ success : 'true'});
                    }, function(res){
                        return res.status(400).send({ error: "Something went wrong please try again later" });
                    });

            }, function(res){
                return res.status(400).send({ error: "Something went wrong please try again later" });
            });
    };

    noteCommentsHelper.get_by_fk = function (req, res) {
       var filterNote = { "note": req.params.id }
       var users = [];
       mongoHelper.get_by_multiplefk(filterNote)
            .then(function(response){
                var comments = JSON.parse(response);
                if (comments.length < 1) {
                    return res.send({ error: "Something went wrong please try again later" });
                }
                for(var i = 0;i < comments.length; i++){
                    var comment = comments[i].comment;
                    var created_date = comments[i].created_date;

                    userHelper.get_by_id(comments[i].user)
                    .then(function (response) {
                        users.push({"id": response._id, "username": response.username, "profilepic": response.profilepic});

                        if (users.length == comments.length){
                            return res.send({users: users, comments: comments});
                        }
                    }, function (res) {
                        return res.status(400).send(err);
                    });
                }
			}, function(res){
				return res.status(400).send(err);
			});
    };

    noteCommentsHelper.getlatest = function (req, res) {
        var field = "created_date";
        mongoHelper.getLatest(field)
		    .then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    module.exports = noteCommentsHelper;

})();

