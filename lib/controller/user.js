'use strict';

function UserController () {

}

UserController.prototype.getUser  = function (req, res, next) {
    return "test";
};


module.exports = new UserController();