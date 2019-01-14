(function () {
    "use strict";
    var config = require(process.cwd() + '\\common\\config');
    var conString = config.db.connectionString;
    var MongoClient = require('mongodb').MongoClient;
    var mongo = require('mongodb');
    var promise = require("q");

    var activityHelper = {};
    var mongoHelper = require(process.cwd() + '\\common\\mongo_base')("user-activity");

	activityHelper.create = function (req, res) {
		var activity = {
                        document_id: req.body.documentId,
                        document_type: req.body.documentType,
                        document_title : req.body.documentTitle,
                        document_url : req.body.documentUrl,
                        last_updated_date : new Date(),
                        created_by : req.body.created_by
					   };

        if(req.headers.authorization){
            activity.created_by = req.user.email;
        } else {
            return res.send({ error: "Unauthorized access"});
        }

        var filterEmail = {"created_by": activity.created_by};

        mongoHelper.get_by_multiplefk(filterEmail)
            .then(function(response){
               var userActivityData = JSON.parse(response);
               if(userActivityData.length > 3){
                   userActivityData.sort(function (a, b) {
                     if (a.last_updated_date < b.last_updated_date) {
                         return -1;
                       }
                     if (a.last_updated_date > b.last_updated_date) {
                         return 1;
                       }
                         return 0;
                    });
                   mongoHelper.deleteOne(userActivityData[0]._id);
                   userActivityData.splice(0, 1);
               }

               var result = userActivityData.filter(data => data["document_id"] == activity.document_id);

               if(result.length > 0 ){
                 mongoHelper.update(result[0]._id , activity)
                   .then(function (response) {
                       return res.send({ success: 'true' });
                   }, function (res) {
                       return res.status(400).send({ error: "Something went wrong please try again later"});
                   });
               } else {
                   activity["created_date"] = new Date();
                   mongoHelper.create(activity)
                      .then(function(response){
                          return res.send({ success: 'true' });
                      }, function(res){
                           return res.status(400).send({ error: "Something went wrong please try again later"});
                      });
               }
            }, function (res) {
                    return res.status(400).send({ error: 'Something went wrong please try again later' });
            });

    };

    activityHelper.get_by_fk = function (req, res) {
       if(req.headers.authorization){
            var created_by = req.user.email;
            var name = "created_by";
       } else {
           return res.send({ error: 'Unauthorized access' });
       }
       mongoHelper.get_by_fkid(name, created_by)
            .then(function (response){
                var userActivityData = JSON.parse(response);
                userActivityData.sort(function (a, b) {
                     if (b.last_updated_date < a.last_updated_date) {
                         return -1;
                       }
                     if (b.last_updated_date > a.last_updated_date) {
                         return 1;
                       }
                         return 0;
                    });
                return res.send(userActivityData);
            }, function (res) {
                return res.status(400).send({ error: 'Something went wrong please try again later' });
            });
    };

    module.exports = activityHelper;

})();

