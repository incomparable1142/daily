'use strict';
var multer = require("multer");

module.exports = function(app) {

    // routes
    var apiPath = "/api";
    app.get(apiPath + '/', function (req, res) {

        MongoClient.connect(conString, function (err, db) {
            if (err) throw err;
            return res.send("It works!")
            db.close();
        });
    });

	var lecturerApi = require('./lecturer-api');
    var cityApi = require('./city-api');
    var universityApi = require('./university-api');
    var facultyApi = require('./faculty-api');
    var ratingApi = require('./rating-api');
    var socialNetworkApi = require('./social_network-api');
    var notesApi = require('./notes-api');
    var examApi = require('./exam-api');
    var universityFacultyApi = require('./university_faculty-api');
    var questionApi = require('./questions-api');
    var commentApi = require('./comments-api');
    var suggestionApi = require('./suggestions-api');
    var userApi = require('./users-api');
    var roleApi = require('./roles-api');
    var userRoleApi = require('./user_role-api');
    var lecturerExamApi = require('./lecturer_exam-api');
    var groupCommentApi = require('./group_comment-api');
    var authApi = require('./authentication-api');
    var friendsApi = require('./user_friends-api');
	var bannerApi = require('./banner-api');
	var requestsApi = require('./user_requests-api');
	var qualificationApi = require('./user_education-api');
	var groupApi = require('./group-api');
	var noteCommentsApi = require('./note_comments-api');
	var userActivityApi = require('./user_activity-api');

    var imagestorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/images/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.originalname.split('.')[0] + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

    var notestorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/notes/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.originalname.split('.')[0] + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

    var universitystorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/universities/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.originalname.split('.')[0] + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

    var facultystorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/faculties/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.originalname.split('.')[0] + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

    var type = multer({storage: imagestorage}).single('file');
    var notetype = multer({storage: notestorage}).single('file');
    var univtype = multer({storage: universitystorage}).single('file');
    var factype = multer({storage: facultystorage}).single('file');

    // Admin Url's
    app.post(apiPath + '/adminsignin', authApi.adminSignIn);

    app.get(apiPath + '/admin/users', userApi.getall);
    app.get(apiPath + '/admin/user/:id', userApi.detail);
    app.delete(apiPath + '/admin/user/delete/:id', userApi.delete_user);
    app.get(apiPath + '/admin/administrators', userApi.getadmin);
    app.post(apiPath + '/admin/user/create', userApi.create);
	
	app.get(apiPath + '/admin/banners/get', bannerApi.getall);
    app.delete(apiPath + '/admin/banner/delete/:id', bannerApi.delete_banner);
    app.get(apiPath + '/admin/banner/:id', bannerApi.get_by_id);
    app.put(apiPath + '/admin/banner/update/:id', bannerApi.update);
    app.post(apiPath + '/admin/banner/create', bannerApi.create);

    app.get(apiPath + '/admin/lecturers/get', lecturerApi.getall);
    app.delete(apiPath + '/admin/lecturer/delete/:id', lecturerApi.delete_lecturer);
    app.get(apiPath + '/admin/lecturer/:id', lecturerApi.get_by_id);
    app.put(apiPath + '/admin/lecturer/update/:id', lecturerApi.update);
    app.post(apiPath + '/admin/lecturer/create', lecturerApi.create);

    app.get(apiPath + '/admin/lecturerexams/get', lecturerExamApi.getall);
    app.delete(apiPath + '/admin/lecturerexam/delete/:id', lecturerExamApi.delete_lecturerexam);
    app.post(apiPath + '/admin/assignment/create', lecturerExamApi.create);
    app.get(apiPath + '/admin/assignment/:id', lecturerExamApi.get_by_id);
    app.put(apiPath + '/admin/assignment/update/:id', lecturerExamApi.update);

    app.get(apiPath + '/admin/universities/get', universityApi.getall);
    app.delete(apiPath + '/admin/university/delete/:id', universityApi.delete_university);
    app.put(apiPath + '/admin/university/update/:id', universityApi.update);
    app.get(apiPath + '/admin/university/:id', universityApi.get_by_id);
    app.post(apiPath + '/admin/university/create', universityApi.create);

    app.get(apiPath + '/admin/faculties/get', facultyApi.getall);
    app.delete(apiPath + '/admin/faculty/delete/:id', facultyApi.delete_faculty);
    app.put(apiPath + '/admin/update/faculty/:id', facultyApi.update);
    app.get(apiPath + '/admin/faculty/:id', facultyApi.get_by_id);
    app.post(apiPath + '/admin/faculty/create', facultyApi.create);

    app.get(apiPath + '/admin/exams/get', examApi.getall);
    app.delete(apiPath + '/admin/exam/delete/:id', examApi.delete_exam);
    app.get(apiPath + '/admin/exam/:id', examApi.get_by_id);
    app.put(apiPath + '/admin/exam/update/:id', examApi.update);
    app.post(apiPath + '/admin/exam/create', examApi.create);

    app.get(apiPath + '/admin/roles/get', roleApi.getall);
    app.delete(apiPath + '/admin/role/delete/:id', roleApi.delete_role);
    app.get(apiPath + '/admin/role/:id', roleApi.get_by_id);
    app.put(apiPath + '/admin/role/update/:id', roleApi.update);
    app.post(apiPath + '/admin/role/create', roleApi.create);
        
    app.get(apiPath + '/admin/userrole/:id', userRoleApi.get_by_multiplefk);
    app.get(apiPath + '/admin/userroles', userRoleApi.getall);
    app.put(apiPath + '/admin/userrole/update/:id', userRoleApi.update);
    app.post(apiPath + '/admin/userrole/create', userRoleApi.create);

    app.get(apiPath + '/admin/cities/get', cityApi.getall);
    app.get(apiPath + '/admin/city/:id', cityApi.get_by_id);
    app.post(apiPath + '/admin/city/create', cityApi.create);
    app.put(apiPath + '/admin/city/update/:id', cityApi.update);
    app.delete(apiPath + '/admin/city/delete/:id', cityApi.delete_city);

    app.get(apiPath + '/admin/universityfaculties/get', universityFacultyApi.getall);
    app.delete(apiPath + '/admin/universityfaculty/delete/:id', universityFacultyApi.delete_record);
    app.post(apiPath + '/admin/universityfaculty/create', universityFacultyApi.create);
    app.get(apiPath + '/admin/universityfaculty/:id', universityFacultyApi.get_by_id);
    app.put(apiPath + '/admin/universityfaculty/update/:id', universityFacultyApi.update);

    app.get(apiPath + '/admin/question/:id', questionApi.get_by_id);
    app.post(apiPath + '/admin/question/filter', questionApi.get_by_multiplefk);
    app.put(apiPath + '/admin/question/update/:id', questionApi.update);
    app.delete(apiPath + '/admin/question/delete/:id', questionApi.delete_question);
    app.get(apiPath + '/admin/questions/get', questionApi.getall);
    app.post(apiPath + '/admin/question/create', questionApi.create);

    // App Url's
    app.post(apiPath + '/request/create', requestsApi.create);
    app.get(apiPath + '/getrequest/:userid/:friendid', requestsApi.get_by_multiplefk);
    app.delete(apiPath + '/request/delete/:id', requestsApi.delete_friend);
    app.get(apiPath + '/requests/:friendid', requestsApi.get_requests);
    app.put(apiPath + '/request/update/:id', requestsApi.update);

    app.get(apiPath + '/getfriend/:userid/:friendid', friendsApi.get_by_multiplefk);
    app.get(apiPath + '/getallfriends/getbyfk/:id', friendsApi.get_by_fk);

    app.post(apiPath + '/signin', authApi.signIn);
    app.post(apiPath + '/signup', userApi.create);
    app.post(apiPath + '/socialsignup', authApi.socialAuth);
    app.post(apiPath + '/forgotpassword', authApi.forgotPassword);

    app.post(apiPath + '/lecturer/create', lecturerApi.create);
    app.get(apiPath + '/lecturer/get', lecturerApi.getall);
    app.get(apiPath + '/lecturer/detail/:id', lecturerApi.get_by_id);
    app.put(apiPath + '/lecturer/update/:id', lecturerApi.update);
    app.get(apiPath + '/lecturer/search/:name', lecturerApi.search_by_name);
    app.get(apiPath + '/lecturer/search/:name/:n', lecturerApi.search_by_name_limit);

    app.post(apiPath + '/city/create', cityApi.create);
    app.get(apiPath + '/city/get', cityApi.getall);
    app.get(apiPath + '/city/detail/:id', cityApi.get_by_id);
    app.put(apiPath + '/city/update/:id', cityApi.update);

    app.post(apiPath + '/university/create', universityApi.create);
    app.get(apiPath + '/university/get', universityApi.getall);
    app.get(apiPath + '/university/detail/:id', universityApi.get_by_id);
    app.get(apiPath + '/university/:name', universityApi.get_by_slug);
    app.get(apiPath + '/univ/:name', universityApi.get_univ_by_slug);
    app.put(apiPath + '/university/update/:id', universityApi.update);
    app.post(apiPath + '/uploaduniversity/:id', univtype, universityApi.upload);

    app.post(apiPath + '/faculty/create', facultyApi.create);
    app.get(apiPath + '/faculty/get', facultyApi.getall);
    app.get(apiPath + '/faculty/getdistinct', facultyApi.getdistinct);
    app.get(apiPath + '/faculty/detail/:id', facultyApi.get_by_id);
    app.get(apiPath + '/faculty/:name', facultyApi.get_by_slug);
    app.get(apiPath + '/fac/:name', facultyApi.get_fac_by_slug);
    app.put(apiPath + '/faculty/update/:id', facultyApi.update);
    app.post(apiPath + '/uploadfaculty/:id', factype, facultyApi.upload);

    app.post(apiPath + '/rating/create', ratingApi.create);
    app.get(apiPath + '/rating/getlatest', ratingApi.getlatest);
    app.get(apiPath + '/recentrating/getlatestbyfac/:id', ratingApi.getlatestbyfac);
    app.get(apiPath + '/rating/:name/:id', ratingApi.get_avgby_fk);
    app.get(apiPath + '/rating/:id', ratingApi.get_by_fk);
    app.put(apiPath + '/rating/update/:id', ratingApi.update);
    app.get(apiPath + '/ratingaverage/:id', ratingApi.get_avg);
    app.get(apiPath + '/recent/ratings', ratingApi.getrecent);
    app.get(apiPath + '/top/ratings', ratingApi.gettoprated);

    app.post(apiPath + '/socialnetwork/create', socialNetworkApi.create);
    app.get(apiPath + '/socialnetwork/get', socialNetworkApi.getall);
    app.get(apiPath + '/socialnetwork/detail/:id', socialNetworkApi.get_by_id);
    app.put(apiPath + '/socialnetwork/update/:id', socialNetworkApi.update);

    app.post(apiPath + '/note/create', notesApi.create);
    app.get(apiPath + '/note/get', notesApi.getall);
    app.get(apiPath + '/note/detail/:id', notesApi.get_by_id);
    app.get(apiPath + '/note/getbyemail/:email', notesApi.get_by_email);
    app.put(apiPath + '/note/update/:id', notesApi.update);
    app.post(apiPath + '/note/upload/:id', notetype, notesApi.upload);
	app.post(apiPath + '/createnote', notetype, notesApi.createurl);
	app.get(apiPath + '/note/getcount/:name/:id', notesApi.get_countby_fk);
	app.get(apiPath + '/note/getlatest', notesApi.getlatest);
	app.get(apiPath + '/note/getlatestbyfac/:id', notesApi.getlatestbyfac);
	app.get(apiPath + '/note/getdownloaded', notesApi.getdownloaded);
	app.get(apiPath + '/note/search/:name', notesApi.search_by_name);
	app.get(apiPath + '/note/search/:name/:n', notesApi.search_by_name_limit);
	app.post(apiPath + '/note/getbyassignments', notesApi.get_by_assignments);
	app.get(apiPath + '/note/:univid/:facid', notesApi.get_note_by_assignment);

    app.post(apiPath + '/exam/create', examApi.create);
    app.get(apiPath + '/exam/get', examApi.getall);
    app.get(apiPath + '/exam/detail/:id', examApi.get_by_id);
    app.put(apiPath + '/exam/update/:id', examApi.update);

    app.post(apiPath + '/universityfaculty/create', universityFacultyApi.create);
    app.get(apiPath + '/universityfaculty/get', universityFacultyApi.getall);
    app.get(apiPath + '/universityfaculty/detail/:id', universityFacultyApi.get_by_id);
    app.put(apiPath + '/universityfaculty/update/:id', universityFacultyApi.update);
    app.get(apiPath + '/universityfaculty/getfaculty/:id', universityFacultyApi.getfaculty);
	app.get(apiPath + '/universityfaculty/getuniversity/:id', universityFacultyApi.getuniversity);

    app.post(apiPath + '/question/create', questionApi.create);
    app.get(apiPath + '/question/get', questionApi.getlatest);
    app.get(apiPath + '/question/getbyemail/:email', questionApi.get_by_email);
    app.get(apiPath + '/question/detail/:id', questionApi.get_by_id);
    app.put(apiPath + '/question/update/:id', questionApi.update);
    app.get(apiPath + '/question/getlatest', questionApi.getlatest);
    app.get(apiPath + '/question/getlatestbyfac/:id', questionApi.getlatestbyfac);
    app.get(apiPath + '/question/getexam', questionApi.getmaxques_exam);
    app.get(apiPath + '/question/getbyfk/:name/:id', questionApi.get_by_fk);
    app.get(apiPath + '/question/:id', questionApi.get_question_comments_byfk);
    app.get(apiPath + '/question/search/:name', questionApi.search_by_name);
    app.get(apiPath + '/question/search/:name/:n', questionApi.search_by_name_limit);
    app.post(apiPath + '/question/getbyassignments', questionApi.get_by_assignments);
    app.get(apiPath + '/question/:univid/:facid', questionApi.get_ques_by_assignment);

    app.post(apiPath + '/comment/create', commentApi.create);
    app.get(apiPath + '/comment/get', commentApi.getall);
    app.get(apiPath + '/comment/getlatest', commentApi.getlatest);
    app.get(apiPath + '/comment/detail/:id', commentApi.get_by_id);
    app.put(apiPath + '/comment/update/:id', commentApi.update);
    app.get(apiPath + '/comment/getbyfk/:name/:id', commentApi.get_by_fk);
    app.get(apiPath + '/comment/:email', commentApi.get_by_email);

    app.post(apiPath + '/suggestion/create', suggestionApi.create);
    app.get(apiPath + '/suggestion/get', suggestionApi.getall);
    app.get(apiPath + '/suggestion/detail/:id', suggestionApi.get_by_id);
    app.put(apiPath + '/suggestion/update/:id', suggestionApi.update);

    app.post(apiPath + '/user/create', userApi.create);
    app.get(apiPath + '/user/get', userApi.getall);
    app.get(apiPath + '/user/detail/:id', userApi.get_by_id);
    app.put(apiPath + '/user/update/:id', userApi.update);
    app.get(apiPath + '/user/getprofile', userApi.get_by_email);
    app.get(apiPath + '/user/getuser/:id', userApi.get_by_email_id);
    app.post(apiPath + '/user/getusers', userApi.get_by_emailids);
    app.post(apiPath + '/user/checkemail', userApi.check_email);
    app.post(apiPath + '/upload/:id', type, userApi.upload);
    app.get(apiPath + '/user/search/:name', userApi.search_by_name);
    app.post(apiPath + '/user/changepassword/:id', userApi.change_password);

    app.post(apiPath + '/role/create', roleApi.create);
    app.get(apiPath + '/role/get', roleApi.getall);
    app.get(apiPath + '/role/detail/:id', roleApi.get_by_id);
    app.put(apiPath + '/role/update/:id', roleApi.update);

    app.post(apiPath + '/userrole/create', userRoleApi.create);
    app.get(apiPath + '/userrole/get', userRoleApi.getall);
    app.get(apiPath + '/userrole/detail/:id', userRoleApi.get_by_id);
    app.put(apiPath + '/userrole/update/:id', userRoleApi.update);

    app.post(apiPath + '/lecturerexam/create', lecturerExamApi.create);
    app.get(apiPath + '/lecturerexam/get', lecturerExamApi.getall);
    app.get(apiPath + '/lecturerexam/detail/:id', lecturerExamApi.get_by_id);
    app.put(apiPath + '/lecturerexam/update/:id', lecturerExamApi.update);
    app.get(apiPath + '/lecturerexam/:univid/:facid', lecturerExamApi.get_by_multiplefk);
    app.get(apiPath + '/examcomment/:univid/:facid', lecturerExamApi.get_comment_by_fk);
    app.get(apiPath + '/lecturersearch/search/:field/:name', lecturerExamApi.search_by_name);
    app.get(apiPath + '/lecturersearch/searchmultiple/:name', lecturerExamApi.search_by_multiple);

    app.post(apiPath + '/qualification/create', qualificationApi.create);
    app.get(apiPath + '/qualification/get', qualificationApi.getall);
    app.get(apiPath + '/qualification/detail/:id', qualificationApi.get_by_multiplefk);
    app.put(apiPath + '/qualification/update/:id', qualificationApi.update);

    app.post(apiPath + '/group/create', groupApi.create);
    app.get(apiPath + '/groups', groupApi.getall);
    app.get(apiPath + '/groups/:univid/:facid', groupApi.get_by_multiplefk);
    app.get(apiPath + '/group/detail/:id', groupApi.get_by_id);

    app.post(apiPath + '/groupcomment/create', groupCommentApi.create);
    app.get(apiPath + '/groupcomment/getbygroup/:id', groupCommentApi.get_by_group);

    app.post(apiPath + '/notecomment/create', noteCommentsApi.create);
    app.get(apiPath + '/notecomment/getbyfk/:id', noteCommentsApi.get_by_fk);
    app.get(apiPath + '/notecomment/getlatest', noteCommentsApi.getlatest);

    app.post(apiPath + '/activity/create', userActivityApi.create);
    app.get(apiPath + '/activity/getbyfk', userActivityApi.get_by_fk);

    //to get records by FK
    app.get(apiPath + '/city/getbyfk/:name/:id', cityApi.get_by_fk);
    app.get(apiPath + '/lecturerexam/getbyfk/:name/:id', lecturerExamApi.get_by_fk);
    app.get(apiPath + '/note/getbyfk/:name/:id', notesApi.get_by_fk);

};

