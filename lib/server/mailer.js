"use strict";

var nodemailer = require('nodemailer')
  , config = require('../../config/config')
  , Q = require('q')
  ;

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.mail.username,
    pass: config.mail.password
  }
});

module.exports.sendMail = function (to, title, msg) {
  // setup e-mail data with unicode symbols
  var opts = {
    from: config.mail.appname + ' <' + config.mail.username + '>', // sender address
    to: to, // list of receivers
    subject: title, // Subject line
    text: msg // plaintext body
  };

  // send mail with defined transport object
  return Q.nfcall(transporter.sendMail, opts);
};
