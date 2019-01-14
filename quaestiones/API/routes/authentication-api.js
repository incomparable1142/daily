(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("user");
    var baseHelper = require(process.cwd() + '\\common\\mongo_base')("user_role");
    var roleHelper = require(process.cwd() + '\\common\\mongo_base')("role");

    var authHelper = {};

    authHelper.signUp = function (req, res) {
		var user = {
                        name : req.body.name,
                        email: req.body.email.toLowerCase(),
                        phonenumber : req.body.phonenumber,
                        university : req.body.university,
                        faculty : req.body.faculty,
                        dob: req.body.dob,
                        username : req.body.username.toLowerCase(),
                        password : req.body.password,
                        profilepic: req.body.profilepic,
                        created_date : new Date(),
                        last_updated_date : new Date()
                    };
        mongoHelper.encryptPassword(user.password).then(function(response){
            user.password = response;
        }, function(err){
            return res.send({ error : err });
        });
        var subject = 'Welcome to Quaestiones.com';
        var emailBody = 'Hi ' + user.name + ', Welcome to Quaestiones.com. Thankyou for registering with us. Team Quaestiones';
        var htmlbody = 'Hi ' + user.name + ',<br><br> Welcome to Quaestiones.com. Thankyou for registering with us. <br><br> Team Quaestiones';
        mongoHelper.create(user)
            .then(function(response){
                mongoHelper.sendEmail(user.email, subject, emailBody, htmlbody);
                return res.send(response);
            }, function(res){
                return res.status(400).send(err);
            });
    };

    authHelper.signIn = function (req, res) {
		var user = {
                        username : req.body.username.toLowerCase(),
                        password : req.body.password
                    };
        mongoHelper.encryptPassword(user.password).then(function(response){
            user.password = response;
        }, function(err){
            return res.send({ error : err });
        });
		mongoHelper.authentication(user)
			.then(function(response){
			    return res.send({ token:response });
			}, function(err){
				return res.send({ error : err });
			});
    };

    authHelper.adminSignIn = function (req, res) {
		var user = {
                        username : req.body.username.toLowerCase(),
                        password : req.body.password
                    };
        var name = "user";

        mongoHelper.encryptPassword(user.password).then(function(response){
            user.password = response;
        }, function(err){
            return res.send({ error : err });
        });

		mongoHelper.adminAuthentication(user)
			.then(function(response){
			    var email = response.email;
                 baseHelper.get_by_fkid(name, response._id.toString())
                .then(function(response){
                    var resp = JSON.parse(response);
                    if(resp.length == 0)
                    {
                        return res.send({ error : "Invalid Username/Password" });
                    }
                     roleHelper.get_by_id(resp[0].role)
                    .then(function(response){
                        if(response.role == 'admin'){
                            roleHelper.generateToken(email, response.role).then(function(response){
                                return res.send({ token : response });
                            }, function(err){
                                return res.send({ error : err });
                            });
                        }else{
                            return res.send({ error : "Invalid Username/Password" });
                        }
                    }, function(res){
                        return res.status(400).send(err);
                    });

                }, function(res){
                    return res.status(400).send(err);
                });

			}, function(err){
				return res.send({ error : err });
			});
	};

    authHelper.forgotPassword = function (req, res) {
		var email = req.body.email.toLowerCase();

        var subject = 'Credentials for Quaestiones';

		mongoHelper.checkEmail(email)
			.then(function(response){
			    if(response == null || response == '' || response == 'undefined'){
                   return res.send({ error : "Invalid Email" });
                }else {
                    var name = response.name;
                    var userName = response.username;
                    mongoHelper.decryptPassword(response.password).then(function(response){
                        var password = response;
                        var emailBody = 'Hi ' + name + ', You are receiving this mail as you requested for password. Your credentials Username : ' + userName + ' Password : ' + password + ' Thanks, Team Quaestiones';
                        var htmlbody = 'Hi ' + name + ',<br><br> You are receiving this mail as you requested for password. <br><br> Your credentials <br> Username : ' + userName + ' <br> Password : ' + password + ' <br><br> Thanks, <br> Team Quaestiones';
                        mongoHelper.sendEmail(email, subject, emailBody, htmlbody);
                        var resp = 'Email sent successfully !!';
                        return res.send({ message: resp});
                    }, function(err){
                        return res.send({ error : err });
                    });
                }
			}, function(err){
				return res.send({ error : err });
			});
    };

    authHelper.socialAuth = function (req, res) {
		var user = {
                        name : req.body.name,
                        email: req.body.email.toLowerCase(),
                        phonenumber : req.body.phonenumber,
                        university : req.body.university,
                        faculty : req.body.faculty,
                        dob: req.body.dob,
                        username : req.body.username.toLowerCase(),
                        password : req.body.password,
                        profilepic: req.body.profilepic,
                        created_date : new Date(),
                        last_updated_date : new Date()
                    };

		mongoHelper.socialAuthentication(user)
			.then(function(response){
			    return res.send({ token:response });
			}, function(err){
				return res.send({ error : err });
			});
    };

    module.exports = authHelper;

})();

