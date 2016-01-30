"use strict";

var express = require('express')
 , userController = require('../../controller/user');

var user = express();

user.get('/users/:id', userController.getUser);


module.exports = user;