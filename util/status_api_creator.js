"use strict";

var status = require('../lib/server/status')
  , _ = require('underscore')
  , path = require('path')
  , fs = require('fs')
  ;

var createStatusDoc = function () {
  var location = path.resolve(__dirname, '../lib/route/status_api.js');

  var filestream = fs.createWriteStream(location, {
    flags: 'w',
    defaultEncoding: 'utf8',
    fd: null,
    mode: 0o666,
    autoClose: true
  });

  filestream.write('"use strict";\n\n');

  _.mapObject(status.codes, (val, key) => {
    if (key !== 'Success') {
      filestream.write('/**\n');
      filestream.write(' * @apiDefine ' + key +'\n');
      filestream.write(' * @apiError ' + key + ' (' + val.code + ') ' + val.summary + '\n');
      filestream.write(' */\n\n');
    }
  });

  filestream.end('');
  filestream.on('finish', () => {
    console.error('all writes are now complete.');

    process.exit(0);
  });
};

createStatusDoc();