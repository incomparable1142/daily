(function() {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");

    var groupCommentHelper = {};
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("group_comment");

    groupCommentHelper.create = function (req, res) {
		var groupComment = {
		                name : req.body.name,
						comment : req.body.comment,
						group: req.body.group,
                        created_date : new Date(),
                        last_updated_date : new Date(),
                        created_by : req.body.created_by
					};
        mongoHelper.create(groupComment)
            .then(function (response) {
                return res.send({ success: 'true' });
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    groupCommentHelper.get_by_group = function (req, res) {
       var group = { "group": req.params.id }
       var field = "created_date";
       mongoHelper.get_by_multiplefk_sorted(group,field)
        .then(function(response){
             return res.send(response);
        }, function(res){
             return res.status(400).send(err);
        });
    };


    module.exports = groupCommentHelper;
})();