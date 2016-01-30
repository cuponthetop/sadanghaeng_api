"use strict";

var codes = {
  Success: {
    code: 0,
    summary: 'success'
  },
  InsufficientParameter: {
    code: 10,
    summary: 'Supplied parameters were not sufficient for' +
    'handling request'
  }
};

if (typeof module !== "undefined") {
  module.exports.codes = codes;
  module.exports.getSummaryByCode = function (code) {
    code = parseInt(code, 10);
    for (var c in codes) {
      if (typeof codes[c].code !== "undefined" && codes[c].code === code) {
        return codes[c].summary;
      }
    }
    return 'An error occurred';
  };
}