(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("social_network");

    var socialNetworkHelper = {};

	socialNetworkHelper.create = function (req, res) {
		var socialNetwork = {
                                name : req.body.name,
                                link: req.body.link,
                                created_date : new Date(),
                                last_updated_date : new Date(),
                                created_by : req.body.created_by
					        };
		mongoHelper.create(socialNetwork)
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
	};

    socialNetworkHelper.getall = function (req, res) {
        mongoHelper.getall()
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    socialNetworkHelper.get_by_id = function (req, res) {
        mongoHelper.get_by_id(req.params.id)
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    socialNetworkHelper.update = function (req, res) {
          var newvalues = {
                            name : req.body.name,
                            link: req.body.link,
                            created_date : new Date(),
                            last_updated_date : new Date(),
                            created_by : req.body.created_by
                          };
        mongoHelper.update(req.params.id, newvalues)
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    module.exports = socialNetworkHelper;

})();

