(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");

    var groupHelper = {};
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("group");

    groupHelper.create = function (req, res) {
		var group = {
						title : req.body.title,
						category: req.body.category,
						university_id : req.body.university_id,
						university: req.body.university,
						faculty_id : req.body.faculty_id,
						faculty : req.body.faculty,
                        created_date : new Date(),
                        last_updated_date : new Date(),
                        created_by : req.body.created_by
					};

        mongoHelper.create(group)
            .then(function (response) {
                return res.send({ success: 'true' });
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    groupHelper.getall = function (req, res) {
        mongoHelper.getall()
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    groupHelper.get_by_id = function (req, res) {
        mongoHelper.get_by_id(req.params.id)
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    groupHelper.get_by_multiplefk = function (req, res) {
        var obj = { "university_id": req.params.univid, "faculty_id": req.params.facid };
        var field = "created_date";
        mongoHelper.get_by_multiplefk_sorted(obj,field)
        .then(function (response) {
              return res.send(response);
          }, function (res) {
              return res.status(400).send(err);
        });
    };

    groupHelper.update = function (req, res) {
           var newvalues = {
                            name : req.body.name,
							university_campus : req.body.university_campus,
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

    module.exports = groupHelper;

})();

