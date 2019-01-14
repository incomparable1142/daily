(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("university");
    var unifacHelper = require(process.cwd() + '\\common\\mongo_base')("university_faculty");

    var universityHelper = {};

	universityHelper.create = function (req, res) {
	    var university = {
                            name : req.body.name,
                            slug: req.body.name.replace(/ /g, "-").toLowerCase(),
                            establishment_date : req.body.establishment_date,
                            description: req.body.description,
                            website: req.body.website,
                            city: req.body.city,
                            image: "",
                            created_date : new Date(),
                            last_updated_date : new Date(),
                            created_by : req.body.created_by
                         };

        var filterSlug = {"slug": university.slug};

        mongoHelper.get_by_multiplefk(filterSlug)
			.then(function(response){
			    var univData = JSON.parse(response);
					if(univData.length > 0 ){
						return res.send({ error: 'University Name Already Exists' });
					} else{
						mongoHelper.create(university)
                            .then(function (response) {
                                return res.send({ success: 'true' });
                            }, function (res) {
                                return res.status(400).send(err);
                        });
					}
			}, function(err){
				return res.status(400).send(err);
        });

    };

    universityHelper.getall = function (req, res) {
        mongoHelper.getall()
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    universityHelper.get_by_id = function (req, res) {
        mongoHelper.get_by_id(req.params.id)
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    universityHelper.get_by_slug = function (req, res) {

        var filterSlug = {"slug": req.params.name};
		var name = "university";
        mongoHelper.get_by_multiplefk(filterSlug)
            .then(function(response){

				var univData = JSON.parse(response);
				unifacHelper.get_by_fkid(name, univData[0]._id)
					.then(function(response){
						return res.send(response);
					}, function(res){
						return res.status(400).send(err);
					});
					
            }, function (res) {
                return res.status(400).send(err);
            });

    }

    universityHelper.get_univ_by_slug = function (req, res) {

        var filterSlug = {"slug": req.params.name};
		var name = "university";
        mongoHelper.get_by_multiplefk(filterSlug)
            .then(function(response){
				return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });

    }

    universityHelper.update = function (req, res) {
          var newvalues = {
                            name : req.body.name,
                            slug: req.body.name.replace(/ /g, "-").toLowerCase(),
                            establishment_date: req.body.establishment_date,
                            description: req.body.description,
                            website: req.body.website,
                            city: req.body.city,
                            created_date : new Date(),
                            last_updated_date : new Date(),
                            created_by : req.body.created_by
                          };
        var filterSlug = {"slug": newvalues.slug};

        mongoHelper.get_by_id(req.params.id)
			.then(function(response){
			    if (response == null || response == '' || response == undefined)
                {
                    return res.send({ error: "Something went wrong please try again later" });
                }

                if(newvalues.slug == response.slug){
                        mongoHelper.update(req.params.id, newvalues)
                            .then(function (response) {
                                return res.send({ success: 'true' });
                            }, function (res) {
                                return res.status(400).send(err);
                        });
                } else {
                        mongoHelper.get_by_multiplefk(filterSlug)
			                .then(function(response){
			                    var univData = JSON.parse(response);
                                if(univData.length > 0 ){
                                    return res.send({ error: 'University Name Already Exists' });
                                } else {
                                    mongoHelper.update(req.params.id, newvalues)
                                        .then(function (response) {
                                            return res.send({ success: 'true' });
                                        }, function (res) {
                                            return res.status(400).send(err);
                                    });
                                }
                        });
                }

			}, function(err){
				return res.status(400).send(err);
        });

    };

    universityHelper.upload = function (req, res) {
        var filePath = req.protocol + '://' + req.headers.host + '/universities/' + req.file.filename;

        var newvalue = {
                        image: filePath,
                        last_updated_date : new Date()
                      };
        mongoHelper.update(req.params.id , newvalue)
            .then(function(response){
                return res.send(filePath);
            }, function(res){
                return res.status(400).send(err);
            });

    };

    universityHelper.delete_university = function (req, res) {
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

    module.exports = universityHelper;

})();

