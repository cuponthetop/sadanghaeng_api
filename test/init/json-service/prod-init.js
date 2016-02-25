var mongoInit = require('./mongo-init')
  , userInit = require('./users-init')
  , univInit = require('./universitys-init')
  , postInit = require('./posts-init')
  , commentInit = require('./comments-init')
  , Q = require('q')
  ;

[
  mongoInit.connect
  , univInit
  , userInit
  , postInit
  , commentInit
  , mongoInit.disconnect
].reduce(Q.when, Q())
.catch(console.log)
.fin(() => {
  process.exit(0);
});
