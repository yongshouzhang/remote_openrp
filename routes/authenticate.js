var express = require('express');
var router = express.Router();
var fs = require("fs");
var openid= require('openid');

module.exports = function (relyingParty) {
  router.all('/', function (req, res, next) {

    relyingParty.extensions = [
      new openid.StoreRequest({ "http://192.168.0.100:3000/": req.sessionID }),
    ];

    relyingParty.authenticate(req.body.username, false, function (error, authUrl) {
      if (error) {
        res.status(200).send('Authentication failed: ' + error.message);
        //res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        //res.end('Authentication failed: ' + error.message);
      }
      else if (!authUrl) {
        //res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.status(200).send('Authentication failed');
      }
      else {
        res.redirect(302,authUrl);
      }
    });
    
  });
  return router;
};
