"use strict";

var chai = require('chai')
  , chaiAsPromised = require('chai-as-promised')
  ;

chai.use(chaiAsPromised);
chai.should();

require('colors');

module.exports = chai;
