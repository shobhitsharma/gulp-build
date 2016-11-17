module.exports = function () {
  var ncp = require('ncp');
  var del = require('del');
  var path = require('path');
  var getDir = require('../../functions/get-dir');
  var gulpConfig = require('../../functions/gulp-config').userConfig;

  // Copies build folder to the directory defined in the "copyToFolder" property in gulp-config.json

  return function () {
    if (gulpConfig.builder.copyToFolder) {
      var copyPath = path.join(global.prefix + gulpConfig.builder.copyToFolder);
      del.sync(copyPath, {force: true});
      ncp(getDir.build(''), copyPath, function (err) {
        if (err) {
          return console.error(err);
        }
      });
    }
  }
};