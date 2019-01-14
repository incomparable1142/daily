(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("faculty");
    var univfacHelper = require(process.cwd() + '\\common\\mongo_base')("university_faculty");

    var facultyHelper = {};

    facultyHelper.create = function (req, res) {
		var faculty = {
						title : req.body.title,
						slug: req.body.title.replace(/ /g, "-").toLowerCase(),
						subtitle : req.body.subtitle,
						subtitleslug: "",
						description : req.body.description,
						image: "",
						created_date : new Date(),
						last_updated_date : new Date(),
						created_by : req.body.created_by
					  };
		if(faculty.subtitle){
		    faculty.subtitleslug = faculty.subtitle.replace(/ /g, "-").toLowerCase();
		}
		var filterSlug = {"slug": faculty.slug, "subtitleslug": faculty.subtitleslug};
		
		mongoHelper.get_by_multiplefk(filterSlug)
			.then(function(response){
			    var facultyData = JSON.parse(response);
					if(facultyData.length > 0 ){
						return res.send({ error: 'Faculty title/subtitle Already Exists' });
					} else{
						mongoHelper.create(faculty)
                            .then(function (response) {
                                return res.send({ success: 'true' });
                            }, function (err) {
                                return res.status(400).send(err);
                        });
					}
			}, function(err){
				return res.status(400).send(err);
        });
			
    };

    facultyHelper.upload = function (req, res) {
        var filePath = req.protocol + '://' + req.headers.host + '/faculties/' + req.file.filename;

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

    facultyHelper.getall = function (req, res) {
        mongoHelper.getall()
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    facultyHelper.getdistinct = function (req, res) {
        mongoHelper.getdistinct()
            .then(function (response) {
                return res.send(response);
            }, function (res) {
                return res.status(400).send(err);
            });
    };

    facultyHelper.get_by_id = function (req, res) {
        mongoHelper.get_by_id(req.params.id)
            .then(function (response) {
                return res.send(response);
            }, function (err) {
                return res.status(400).send(err);
            });
    };

    facultyHelper.get_by_slug = function (req, res) {

        var filterSlug = {"slug": req.params.name};
		var name = "faculty";
        mongoHelper.get_by_multiplefk(filterSlug)
            .then(function(response){

				var facData = JSON.parse(response);
				if(facData.length > 1){
				     var faculty_ids = [];
				     for(var i = 0;i < facData.length; i++){
                         faculty_ids.push(facData[i]._id);
                     }
				     var facultyFilter = {"faculty": {'$in': faculty_ids}};
				     univfacHelper.get_by_multiplefk(facultyFilter)
                        .then(function(response){
                            return res.send(response);
                        }, function (err) {
                            return res.status(400).send(err);
                     });

				}else {
				    univfacHelper.get_by_fkid(name, facData[0]._id)
                        .then(function(response){
                            return res.send(response);
                        }, function(res){
                            return res.status(400).send(err);
					});
				}
					
            }, function (err) {
                return res.status(400).send(err);
            });

    }

    facultyHelper.get_fac_by_slug = function (req, res) {

        var filterSlug = {"slug": req.params.name};
		var name = "faculty";
        mongoHelper.get_by_multiplefk(filterSlug)
            .then(function(response){
                return res.send(response);
            }, function (err) {
                return res.status(400).send(err);
            });

    }

    facultyHelper.update = function (req, res) {
		 var newvalues = {
                            title : req.body.title,
                            slug: req.body.title.replace(/ /g, "-").toLowerCase(),
                            subtitle : req.body.subtitle,
                            subtitleslug: "",
                            description : req.body.description,
                            created_date : new Date(),
                            last_updated_date : new Date(),
                            created_by : req.body.created_by
                          };
         if(newvalues.subtitle){
		    newvalues.subtitleslug = newvalues.subtitle.replace(/ /g, "-").toLowerCase();
		 }
		var filterSlug = {"slug": newvalues.slug, "subtitleslug": newvalues.subtitleslug};

        mongoHelper.get_by_id(req.params.id)
			.then(function(response){
			    if (response == null || response == '' || response == undefined)
                {
                    return res.send({ error: "Something went wrong please try again later" });
                }

                if(newvalues.slug == response.slug && newvalues.subtitleslug == response.subtitleslug){
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
                                    return res.send({ error: 'Faculty title/subtitle Already Exists' });
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

    facultyHelper.delete_faculty = function (req, res) {
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

    module.exports = facultyHelper;

})();
