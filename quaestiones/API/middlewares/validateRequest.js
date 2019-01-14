var jwt = require("jsonwebtoken");
var config = require(process.cwd() + '\\common\\config');

module.exports = function(req, res, next) {
    
    if (req.headers && req.headers.authorization) {
        jwt.verify(req.headers.authorization, config.secret, function (err, decode) {
            if (err){
                res.json({"status": 403,"message": "Not Authorized"});
            }
            req.user = decode;

            if (req.url.indexOf('admin') >= 0 && req.user.role == 'admin') {
                next();
            }else{
                res.json({"status": 403,"message": "Not Authorized"});
            }

        });
    }else{
        res.json({"status": 403,"message": "Not Authorized"});
    }
};