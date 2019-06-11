var express = require('express');
var router = express.Router();
var fs = require("fs");

module.exports = function (relyingParty) {

    router.all('/', function (req, res, next) {
        if (req.headers.accept.indexOf("application/xrds+xml") !== -1) {
            res.status(200).type("application/xrds+xml").sendFile(path.resolve("xrds.xml")).end();
            return;
        }

        relyingParty.verifyAssertion(req, function (error, result) {
            res.status(200).type("text/plain");
            if (error) {
                res.end('Authentication failed: ' + error.message);
            }
            else {
                res.end((result.authenticated ? 'Success :)' : 'Failure :(') +
                    '\n\n' + JSON.stringify(result));
            }
        });
    });
    
    return router;
};