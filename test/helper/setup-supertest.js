"use strict";

var methods = require("methods")
  , PromiseQ = require("q").Promise
  , session = require("supertest-session")
  ;

var makeModule = function (Promise) {
  var toPromise = function () {
    // var self = this;
    return new Promise(function (resolve, reject) {
      // self.end(function (err, res) {
      this.end((err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    }.bind(this));
  };

  var then = function (onFulfilled, onRejected) {
    return this.toPromise().then(onFulfilled, onRejected);
  };

  // Creates a new object that wraps `factory`, where each HTTP method
  // (`get`, `post`, etc.) is overriden to inject a `then` method into
  // the returned `Test` instance.
  var wrap = function (factory) {
    var out = {};

    methods.forEach((method) => {
      out[method] = function () {
        var test = factory[method].apply(factory, arguments);
        test.toPromise = toPromise;
        test.then = then;
        return test;
      };
    });

    Object.defineProperty(out, 'cookies', {
      get: () => { return factory.cookies; },
      set: (val) => { factory.cookies = val; }
    });

    return out;
  };

  var out = function (app, options) {
    return wrap(session(app, options));
  }

  // out.agent = function () {
  //   var agent = session.agent.apply(null, arguments);
  //   return wrap(agent);
  // };

  return out;
};


// For backwards compatibility, we allow SuperTest as Promised to be
// used without an explicit `Promise` constructor. Pass these requests
// through to a default module that uses Q promises.

module.exports = makeModule(PromiseQ);

// module.exports.agent = defaultModule.agent;