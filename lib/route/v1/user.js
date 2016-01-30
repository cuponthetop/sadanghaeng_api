"use strict";

var express = require('express')
// , User = require('../../model/user')
// , config = require('../../../config/config')
    ;

var stat = express();

stat.get('/user/:id', function (req, res) {
    res.status(200).json({ name: req.params.id });
});


module.exports = stat;