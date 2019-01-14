(function () {
    "use strict";
    var express = require('express');
    var app = express();
    var nodemailer = require('nodemailer');
    var aesjs = require('aes-js');

    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var md5 = require('md5');
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");

    function mongoHelper(collection) {
        var self = this;
        
        var _collection = collection;

        // 128-bit key
        var key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
                   27, 28, 29, 30, 31];

        let jwt = require('jsonwebtoken');
        app.set('superSecret', config.secret);

        this.encryptPassword  = function (password) {
            var deferred = promise.defer();

            var text = password;
            var textBytes = aesjs.utils.utf8.toBytes(text);

            var aesCtr = new aesjs.ModeOfOperation.ctr(key);
            var encryptedBytes = aesCtr.encrypt(textBytes);

            var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
            deferred.resolve(encryptedHex);
            return deferred.promise;
        }

        this.decryptPassword  = function (decryptPassword) {
            var deferred = promise.defer();
            try{
                var encryptedBytes = aesjs.utils.hex.toBytes(decryptPassword);

                var aesCtr = new aesjs.ModeOfOperation.ctr(key);
                var decryptedBytes = aesCtr.decrypt(encryptedBytes);

                var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
                deferred.resolve(decryptedText);
            }
            catch(e)
            {
                deferred.reject("");
            }
            return deferred.promise;
        }

        this.create = function (obj) {
            var deferred = promise.defer();
            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);

                var db = client.db(config.db.name);
                db.collection(_collection).insertOne(obj, function (err, response) {
                    if (err) {
                        deferred.reject(err);
                    };
                    deferred.resolve(JSON.stringify(obj));
                    client.close();
                });
            });
            return deferred.promise;
        };


        this.createmany = function (obj) {
            var deferred = promise.defer();
            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);

                var db = client.db(config.db.name);
                db.collection(_collection).insertMany(obj, function (err, response) {
                    if (err) {
                        deferred.reject(err);
                    };
                    deferred.resolve(JSON.stringify(obj));
                    client.close();
                });
            });
            return deferred.promise;
        };


        this.getall = function () {
            var deferred = promise.defer();
            MongoClient.connect(conString, function (err, client) {
                if (err) throw err;
                var db = client.db(config.db.name);
                db.collection(_collection).find({}).toArray(function (err, response) {
                    if (err) deferred.reject(err);

                    client.close();
                    deferred.resolve(JSON.stringify(response));
                });
            });
            return deferred.promise;
        };

        this.getdistinct = function () {
            var deferred = promise.defer();
            MongoClient.connect(conString, function (err, client) {
                if (err) throw err;
                var db = client.db(config.db.name);
                db.collection(_collection).distinct("slug", function (err, response) {
                    if (err) deferred.reject(err);
                    client.close();
                    deferred.resolve(JSON.stringify(response));
                });
            });
            return deferred.promise;
        };

        this.get_by_id = function (id) {

            var deferred = promise.defer();
            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);

                var db = client.db(config.db.name);
                db.collection(_collection).findOne({ _id: new mongo.ObjectID(id) }, function (err, user) {
                    if (err)
                    {
                        deferred.reject(err);
                    }
                    deferred.resolve(user);
                    client.close();
                });
            });
            return deferred.promise;
        };

        this.deleteOne = function (id) {
            var deferred = promise.defer();
            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);

                var db = client.db(config.db.name);
                db.collection(_collection).deleteOne({ _id: new mongo.ObjectID(id) }, function (err, response) {
                    if (err)
                    {
                        deferred.reject(err);
                    }
                    deferred.resolve(response.result.n)
                    client.close();
                });
            });
            return deferred.promise;
        };

        this.get_by_fkid = function (name,id) {
            var deferred = promise.defer();

            var name = name;
            var value = id;
            var query = {};
            query[name] = value;

            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);
                var db = client.db(config.db.name);
                db.collection(_collection).find(query).toArray(function (err, response) {
                    if (err) deferred.reject(err);
                    deferred.resolve(JSON.stringify(response));
                    client.close();
                });
            });
            return deferred.promise;
        };

        this.get_by_multiplefk = function (obj) {
            var deferred = promise.defer();

            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);
                var db = client.db(config.db.name);
                db.collection(_collection).find(obj).toArray(function (err, response) {
                    if (err) deferred.reject(err);
                    deferred.resolve(JSON.stringify(response));
                    client.close();
                });
            });
            return deferred.promise;
        };

        this.get_by_multiplefk_sorted = function (obj, field) {
            var deferred = promise.defer();

            var field = field;
            var value = -1;
            var query = {};
            query[field] = value;

            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);
                var db = client.db(config.db.name);
                db.collection(_collection).find(obj).sort(query).toArray(function (err, response) {
                    if (err) deferred.reject(err);
                    deferred.resolve(JSON.stringify(response));
                    client.close();
                });
            });
            return deferred.promise;
        };

        this.get_latest = function (obj,field) {
            var deferred = promise.defer();

            var field = field;
            var value = -1;
            var query = {};
            query[field] = value;

            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);
                var db = client.db(config.db.name);
                db.collection(_collection).find(obj).sort(query).limit(5).toArray(function (err, response) {
                    if (err) deferred.reject(err);
                    deferred.resolve(JSON.stringify(response));
                    client.close();
                });
            });
            return deferred.promise;
        };

        this.get_count = function (obj) {
            var deferred = promise.defer();

            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);
                var db = client.db(config.db.name);

                db.collection(_collection).aggregate([{ "$match": obj},{ "$group": {"_id": "$assignment" ,
                "count": { "$sum": 1 }}}]).toArray(function (err, response) {
                    if (err) deferred.reject(err);
                    deferred.resolve(JSON.stringify(response));
                    client.close();
                });
            });
            return deferred.promise;
        };

        this.get_spec_bymultiplefk = function (obj,fld) {
            var deferred = promise.defer();

            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);
                var db = client.db(config.db.name);
                db.collection(_collection).find(obj).project(fld).toArray(function (err, response) {
                    if (err) deferred.reject(err);

                    deferred.resolve(JSON.stringify(response));
                    client.close();
                });
            });
            return deferred.promise;
        };

        this.getLatest = function (field) {

            var field = field;
            var value = -1;
            var query = {};
            query[field] = value;
            var deferred = promise.defer();

            MongoClient.connect(conString, function (err, client) {
                if (err) throw err;
                var db = client.db(config.db.name);
                db.collection(_collection).find({}).sort(query).limit(5).toArray(function (err, response) {
                    if (err) deferred.reject(err);
                    deferred.resolve(JSON.stringify(response));
                    client.close();
                });
            });
            return deferred.promise;
        };

        this.getLatestDistinct = function () {
            var deferred = promise.defer();

            MongoClient.connect(conString, function (err, client) {
                if (err) throw err;
                 var db = client.db(config.db.name);

                 db.collection(_collection).aggregate([{$group:{_id:"$assignment", date: {$max: '$created_date'}}},
                 {$sort:{date:-1}},{$limit:5}]).toArray(function (err, response) {
                    if (err) deferred.reject(err);
                    deferred.resolve(JSON.stringify(response));
                    client.close();
                });
            });
            return deferred.promise;
        };

        this.getTopDistinct = function () {
            var deferred = promise.defer();

            MongoClient.connect(conString, function (err, client) {
                if (err) throw err;
                 var db = client.db(config.db.name);

                db.collection(_collection).aggregate([{ $group: { _id: "$assignment", total: {$avg:"$average_rating"} } },
                     { $sort: { total: -1 }},{$limit:5}]).toArray(function (err, response){
                     if(err) deferred.reject(err);
                     deferred.resolve(JSON.stringify(response));
                     client.close();
                   })
            });
            return deferred.promise;
        };

        this.getMaxQuestion = function () {
            var deferred = promise.defer();

            MongoClient.connect(conString, function (err, client) {
                if (err) throw err;
                 var db = client.db(config.db.name);

                db.collection(_collection).aggregate([{ $group: { _id: "$assignment",count: {$sum :1}} },
                     { $sort: { count: -1 }},{$limit:5}]).toArray(function (err, response){
                     if(err) deferred.reject(err);
                     deferred.resolve(JSON.stringify(response));
                     client.close();
                   })
            });
            return deferred.promise;
        };

        this.update = function (id, obj) {
            var deferred = promise.defer();

            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);

                var myquery = { _id: new mongo.ObjectID(id) };

                var db = client.db(config.db.name);

                db.collection(_collection).updateOne(myquery, { $set: obj }, { upsert: true }, function (err, response) {
                    if (err) {
                        deferred.reject(err);
                    };
                    client.close();
                    deferred.resolve(JSON.stringify(obj));
                });
            });
            return deferred.promise;
        };

        this.updateMany = function (id, name, obj) {
            var deferred = promise.defer();

            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);

                var myquery = { name : id };

                var db = client.db(config.db.name);

                db.collection(_collection).updateMany(myquery, { $set: obj }, function (err, response) {
                    if (err) {
                        deferred.reject(err);
                    };
                    client.close();
                    deferred.resolve(JSON.stringify(obj));
                });
            });
            return deferred.promise;
        };

        this.authentication = function (obj) {
            var deferred = promise.defer();

            var name = "username";
            var value = obj.username;
            var query = {};
            query[name] = value;

            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);
                var db = client.db(config.db.name);
                db.collection(_collection).find(query).toArray(function (err, user) {
                    if (err) throw err;
                    if (user == '') {
                        let err = "Invalid Username/Password.";
                        deferred.reject(err);
                    } else if (user) {
                           if (user[0].password != obj.password) {
                                let err = "Invalid Username/Password.";
                                deferred.reject(err);
                           } else {
                                 var token = jwt.sign(
                                            { email : user[0].email }, app.get('superSecret'));
                                            deferred.resolve(token);
                           }
                    }

                    client.close();
                });
            });
            return deferred.promise;
        };

        this.adminAuthentication = function (obj) {
            var deferred = promise.defer();

            var name = "username";
            var value = obj.username;
            var query = {};
            query[name] = value;

            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);
                var db = client.db(config.db.name);
                db.collection(_collection).findOne(query, function (err, user) {
                    if (err) throw err;
                    if (user == '' || user == null || user == 'undefined') {
                        let err = "Invalid Username/Password.";
                        deferred.reject(err);
                    } else if (user) {
                           if (user.password != obj.password) {
                                let err = "Invalid Username/Password.";
                                deferred.reject(err);
                           } else {
                                 deferred.resolve(user);
                           }
                    }

                    client.close();
                });
            });
            return deferred.promise;
        };


        this.socialAuthentication = function (obj) {
            var deferred = promise.defer();
            var email = "email";
            var value = obj.email;
            var query = {};
            query[email] = value;

            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);
                var db = client.db(config.db.name);
                db.collection(_collection).find(query).toArray(function (err, user) {
                    if (err) throw err;
                    if (user == '') {
                        db.collection(_collection).insertOne(obj, function (err, response) {
                            if (err) {
                                deferred.reject(err);
                            };
                            var token = jwt.sign(
                                    { email : value }, app.get('superSecret'));
                                    deferred.resolve(token);
                        });
                    } else if (user) {
                         var token = jwt.sign(
                                    { email : user[0].email }, app.get('superSecret'));
                                    deferred.resolve(token);
                    }
                    client.close();
                });
            });
            return deferred.promise;
        };

        this.checkEmail = function (useremail) {
            var deferred = promise.defer();
            var query = {"email": useremail};
            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);
                var db = client.db(config.db.name);
                db.collection(_collection).findOne(query, function (err, user) {
                    if (err)
                    {
                        deferred.reject(err);
                    }
                    deferred.resolve(user);
                    client.close();
                });
            });
            return deferred.promise;
        };

        this.search = function (key, matchval) {
            var deferred = promise.defer();

            var filter = new RegExp(matchval, 'i');

            var field = key
            var query = {};
            query[field] = filter;

            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);
                var db = client.db(config.db.name);
                db.collection(_collection).find(query).toArray(function (err, response) {
                    if (err) deferred.reject(err);
                    deferred.resolve(response);
                    client.close();
                });
            });
            return deferred.promise;
        };

        this.searchmultiple = function (obj) {
            var deferred = promise.defer();

            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);
                var db = client.db(config.db.name);
                db.collection(_collection).find({$or: obj}).toArray(function (err, response) {
                    if (err) deferred.reject(err);
                    deferred.resolve(response);
                    client.close();
                });
            });
            return deferred.promise;
        };

        this.searchLimit = function (key, matchval,n) {
            var deferred = promise.defer();

            var filter = new RegExp(matchval, 'i');

            var field = key
            var query = {};
            query[field] = filter;

            MongoClient.connect(conString, function (err, client) {
                if (err) deferred.reject(err);
                var db = client.db(config.db.name);
                db.collection(_collection).find(query).limit(n).toArray(function (err, response) {
                    if (err) deferred.reject(err);
                    deferred.resolve(response);
                    client.close();
                });
            });
            return deferred.promise;
        };

        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'sender email',
                pass: 'sender password'
            }
        });

        this.sendEmail = function (email, subject ,emailBody, htmlbody) {
            var mailOptions = {
              from: 'sender email',
              to: email,
              subject: subject,
              text: emailBody,
              html: htmlbody
            };

            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
        }

        this.generateToken = function(useremail, userrole){
            var deferred = promise.defer();

            var token = jwt.sign(
            { email : useremail, role : userrole }, app.get('superSecret'));
            deferred.resolve(token);
            return deferred.promise;
        }

    }

    module.exports = function (collection) {
        return new mongoHelper(collection);
    };

})();
