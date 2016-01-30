"use strict";

var express = require('express');
//var router = express.Router();
// , User = require('../../model/user')
// , config = require('../../../config/config')

var user = express();


user.get('/users/:id', function (req, res) {
    res.status(200).json({ name: req.params.id });
});


module.exports = user;