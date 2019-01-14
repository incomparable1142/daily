(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("user");
    var roleHelper = require(process.cwd() + '\\common\\mongo_base')("role");
    var userRoleHelper = require(process.cwd() + '\\common\\mongo_base')("user_role");

    var userHelper = {};

	userHelper.create = function (req, res) {
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

        var filterEmail = {"email": user.email};
        var filterName = {"username": user.username};
        var subject = 'Welcome to Quaestiones.com';
        var emailBody = 'Hi ' + user.name + ', Welcome to Quaestiones.com. Thankyou for registering with us. Team Quaestiones';
        var htmlbody = 'Hi ' + user.name + ',<br><br> Welcome to Quaestiones.com. Thankyou for registering with us. <br><br> Team Quaestiones';

        mongoHelper.encryptPassword(user.password).then(function(response){
            user.password = response;
        }, function(err){
            return res.send({ error : err });
        });
        if(user.username){
            mongoHelper.get_by_multiplefk(filterName)
			.then(function(response){
			    var userNameData = JSON.parse(response);

			    if(userNameData.length > 0 ){
			        return res.send({ error: 'Username Already Exists' });
			    } else{
			        mongoHelper.get_by_multiplefk(filterEmail)
                        .then(function(response){
                            var emailData = JSON.parse(response);

                           if(emailData.length > 0 ){
                                return res.send({ error: 'Email Already Exists' });
                           } else {
                                mongoHelper.create(user)
                                    .then(function(response){
                                        mongoHelper.sendEmail(user.email, subject, emailBody, htmlbody);
                                        return res.send({ success: 'true' });
                                    }, function(err){
                                        return res.status(400).send(err);
                                    });
                           }

                        }, function(res){
                            return res.status(400).send(err);
                        });
			    }
			}, function(res){
				return res.status(400).send(err);
			});
        } else{
                mongoHelper.get_by_multiplefk(filterEmail)
                    .then(function(response){
                        var emailData = JSON.parse(response);

                       if(emailData.length > 0 ){
                            return res.send({ error: 'Email Already Exists' });
                       } else {
                            mongoHelper.create(user)
                                .then(function(response){
                                    mongoHelper.sendEmail(user.email, subject, emailBody, htmlbody);
                                    return res.send({ success: 'true' });
                                }, function(err){
                                    return res.status(400).send(err);
                                });
                       }

                    }, function(res){
                        return res.status(400).send(err);
                    });
        }
    };

    userHelper.getall = function (req, res) {
        mongoHelper.getall()
			.then(function(response){
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    userHelper.get_by_id = function (req, res) {
         mongoHelper.get_by_id(req.params.id)
			.then(function(response){
			    response.password = '';
			    return res.send(response);
			}, function(res){
				return res.status(400).send(err);
			});
    };

    userHelper.detail = function (req, res) {
        mongoHelper.get_by_id(req.params.id)
           .then(function(response){
               var userdata = response;
               if(userdata.password){
                   mongoHelper.decryptPassword(userdata.password).then(function(response){
                       userdata.password = response;
                       return res.send(userdata);
                   }, function(err){
                       return res.send({ error : err });
                   });
               } else{
                   return res.send(userdata);
               }
               
           }, function(res){
               return res.status(400).send(err);
           });
    };

    userHelper.get_by_email = function (req, res) {
         mongoHelper.checkEmail(req.user.email)
			.then(function(response) {
                if (response == null || response == '' || response == undefined)
                {
                    return res.send({ error: "Not Found" });
                }
                response.password = '';
                return res.send(response);
			}, function(res){
				return res.send({ error: err });
			});
    };

    userHelper.get_by_email_id = function (req, res) {
         mongoHelper.checkEmail(req.params.id)
			.then(function(response) {
                if (response == null || response == '' || response == undefined)
                {
                    return res.send({ error: "Not Found" });
                }
                response.password = '';
                return res.send(response);
			}, function(res){
				return res.send({ error: err });
			});
    };

    userHelper.get_by_emailids = function (req, res) {
         var query = {'email': {'$in' : req.body}}
            mongoHelper.get_by_multiplefk(query)
                .then(function (response) {
                    if(response.length > 0){
                        return res.send(response);
                    }
                }, function (res) {
                    return res.status(400).send(err);
            });
    };

    userHelper.check_email = function (req, res) {
        var email = req.body.email;
         mongoHelper.checkEmail(email)
			.then(function(response){
			    if(response == null || response == '' || response == 'undefined'){
			        return res.send({ success : 'true'});
			    }else{
			        return res.send({ error : 'true'});
			    }
			}, function(err){
				return res.send({ error: err });
			});
    };

    userHelper.update = function (req, res) {
          var newvalues = {
                            name : req.body.name,
                            email: req.body.email.toLowerCase(),
                            phonenumber : req.body.phonenumber,
                            university : req.body.university,
                            faculty : req.body.faculty,
                            dob: req.body.dob,
                            username : req.body.username.toLowerCase(),
                            profilepic: req.body.profilepic,
                            last_updated_date : new Date()
                          };

        var filterName = {"username": newvalues.username};
        var filterEmail = { "email": newvalues.email };

        mongoHelper.get_by_id(req.params.id)
            .then(function(response){
                 if (response == null || response == '' || response == undefined)
                {
                    return res.send({ error: "Something went wrong please try again later" });
                }
                if(newvalues.username == response.username && newvalues.email == response.email){
                    mongoHelper.update(req.params.id , newvalues)
                        .then(function(response){
                            return res.send({ success: 'true' });
                        }, function(err){
                            return res.status(400).send(err);
                        });
                }else if(newvalues.username == response.username && newvalues.email != response.email){

                    mongoHelper.get_by_multiplefk(filterEmail)
                        .then(function(response){
                            var emailData = JSON.parse(response);

                           if(emailData.length > 0 ){
                                return res.send({ error: 'Email Already Exists' });
                           } else {
                                mongoHelper.update(req.params.id , newvalues)
                                    .then(function(response){
                                        return res.send({ success: 'true' });
                                    }, function(err){
                                        return res.status(400).send(err);
                                    });
                           }
                        }, function(res){
                            return res.status(400).send(err);
                        });
                }else if(newvalues.username != response.username && newvalues.email == response.email){

                    mongoHelper.get_by_multiplefk(filterName)
                        .then(function(response){
                            var userNameData = JSON.parse(response);
                            if(userNameData.length > 0 ){
                                return res.send({ error: 'Username Already Exists' });
                            } else{
                                mongoHelper.update(req.params.id , newvalues)
                                    .then(function(response){
                                        return res.send({ success: 'true' });
                                    }, function(err){
                                        return res.status(400).send(err);
                                    });
                            }
                        }, function(err){
                            return res.status(400).send(err);
                        });
                }else{
                    mongoHelper.get_by_multiplefk(filterName)
                        .then(function(response){
                            var userNameData = JSON.parse(response);
                            if(userNameData.length > 0 ){
                                return res.send({ error: 'Username Already Exists' });
                            } else{
                                mongoHelper.get_by_multiplefk(filterEmail)
                                    .then(function(response){
                                       var emailData = JSON.parse(response);
                                       if(emailData.length > 0 ){
                                            return res.send({ error: 'Email Already Exists' });
                                       } else {
                                            mongoHelper.update(req.params.id , newvalues)
                                                .then(function(response){
                                                    return res.send({ success: 'true' });
                                                }, function(err){
                                                    return res.status(400).send(err);
                                                });
                                       }
                                    }, function(err){
                                        return res.status(400).send(err);
                                    });
                            }
                        }, function(err){
                            return res.status(400).send(err);
                        });
                }
             }, function(err){
                return res.status(400).send(err);
            });
    };

    userHelper.upload = function (req, res) {
        var filePath = req.protocol + '://' + req.headers.host + '/image/' + req.file.filename;

        var newvalue = {
                        profilepic: filePath,
                        last_updated_date : new Date()
                      };

        mongoHelper.update(req.params.id , newvalue)
            .then(function(response){
                return res.send(filePath);
            }, function(res){
                return res.status(400).send(err);
            });

    };


    userHelper.search_by_name = function (req, res) {
        var name = "name";
         mongoHelper.search(name, req.params.name)
			.then(function(response) {
                if (response == null || response == '' || response == undefined)
                {
                    return res.send({ error: "Not Found" });
                }
                var user = [];
                for (let r of response) {
                    user.push({
                      "_id": r["_id"],
                      "name": r["name"],
                      "profilepic": r["profilepic"]
                    });
                }
			    return res.send(user);
			}, function(err){
				return res.send({ error: err });
			});
    };

    userHelper.change_password = function (req, res) {
        var newvalue = {password : req.body.newPassword}

        mongoHelper.get_by_id(req.params.id)
            .then(function(response){
                 if (response == null || response == '' || response == undefined)
                {
                    return res.send({ error: "User Not Found" });
                }
                mongoHelper.decryptPassword(response.password).then(function(resp){
                    if (resp == req.body.oldPassword){
                        mongoHelper.encryptPassword(newvalue.password).then(function(response){
                             newvalue.password = response;
                          }, function(err){
                             return res.send({ error : err });
                          });

                        mongoHelper.update(req.params.id , newvalue)
                            .then(function(response){
                                return res.send({ success: 'Password Changed Successfully'});
                            }, function(err){
                                return res.status(400).send(err);
                            });
                    }else{
                        return res.send({ error : 'Invalid Password'});
                    }
                  }, function(err){
                     return res.send({ error : err });
                  });
            }, function(err){
                return res.status(400).send(err);
            });
    };

    userHelper.delete_user = function (req, res) {
        mongoHelper.deleteOne(req.params.id)
			.then(function(response){
                if (response == 1){
                    return res.send({ success : 'Removed Successfully'});
                }else{
                    return res.send({ error : 'Unauthorized Request'});
                }
			}, function(res){
				return res.status(400).send(err);
			});
    };
    
    userHelper.getadmin = function (req, res) {       

            var obj = { "role": "admin" }

            roleHelper.get_by_multiplefk(obj)
                .then(function (response) {
                    var resp = JSON.parse(response);
                    var adminrole = { "role": resp[0]._id };
                    userRoleHelper.get_by_multiplefk(adminrole)
                        .then(function (response) {
                            var users = JSON.parse(response);

                            var user = []
                            var i = 0;
							var count = 0;
                            for (i; i < users.length; i++) {
                                mongoHelper.get_by_id(users[i].user)
                                .then(function (response) {
                                    user.push(response);
									if(count == users.length-1){
										return res.send(user);
									}
									count++;
								});
                            }
                            
                    }, function (res) {
                        return res.status(400).send(err);
                    });
                    

                }, function (res) {
                    return res.status(400).send(err);
                });        
        
    };

    module.exports = userHelper;

})();

