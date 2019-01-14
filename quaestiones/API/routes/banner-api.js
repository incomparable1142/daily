(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("banner");

    var bannerHelper = {};

    bannerHelper.create = function (req, res) {
		var city = {
						description : req.body.description,
						code : req.body.code,
						status : req.body.status,
						path : req.body.path,
						position : req.body.position,
                        created_date : new Date(),
                        last_updated_date : new Date(),
                        created_by : req.body.created_by
					};
        mongoHelper.create(city)
            .then(function (response) {
                return res.send({ success: 'true' });
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    bannerHelper.getall = function (req, res) {
        mongoHelper.getall()
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    bannerHelper.get_by_id = function (req, res) {
        mongoHelper.get_by_id(req.params.id)
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    bannerHelper.update = function (req, res) {
           var newvalues = {
                            description : req.body.description,
                            code : req.body.code,
                            status : req.body.status,
                            path : req.body.path,
                            position : req.body.position,
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

    bannerHelper.delete_banner = function (req, res) {
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

    module.exports = bannerHelper;

})();

