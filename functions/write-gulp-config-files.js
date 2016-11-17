var fs                       = require('fs'),
    jsonFile                 = require('jsonfile'),
    _                        = require('lodash'),
    readFile                 = jsonFile.readFile,
    readFileSync             = jsonFile.readFileSync,
    writeFile                = jsonFile.writeFile,
    writeFileSync            = jsonFile.writeFileSync,
    fileExistsSync           = fs.existsSync,
    fileExists               = fs.exists,
    builderProjectConfigTemplate = require('../config/builder-project-config-template'),
    builderUserConfigTemplate    = require('../config/builder-user-config-template'),
    gulpConfig               = require('../functions/gulp-config'),
    files                    = require('../config/files-config'),
    q                        = require('q');

module.exports = function () {
  var jsonStyleConfig = {spaces: 2};

  function checkConfigItems(configItems, templateItems) {
    var newConfig = {};
    _.each(configItems, function (prop, key) {
      // if config property is an object call the function recursive
      if (_.isObject(prop) && !_.isArray(prop)) {
        newConfig[key] = checkConfigItems(prop, templateItems[key]);
        return;
      }
      // write the property only if it exists in the current config template
      if (templateItems[key] !== undefined) {
        newConfig[key] = prop;
      }
    });

    return _.extend(templateItems, newConfig);
  }

  function updateAndWriteConfig(configFilePath, builderConfigTemplate, propertyToUpdate) {
    var deferred = q.defer();

    configFilePath = global.prefix + configFilePath;
    // if config file doesn't exist, write a new file with the default builder template settings

    if (!fileExistsSync(configFilePath)) {
      gulpConfig[propertyToUpdate] = builderConfigTemplate
      writeFile(configFilePath, builderConfigTemplate, jsonStyleConfig, function () {
        deferred.resolve(builderConfigTemplate);
      });
    }
    else {
      //if config file exists, check if some properties don't exist in the builder default template anymore and remove them
      var configItems = readFileSync(configFilePath);

      // save the new config file
      var finalConfigItems = checkConfigItems(configItems, builderConfigTemplate);
      gulpConfig[propertyToUpdate] = finalConfigItems;

      writeFile(configFilePath, finalConfigItems, jsonStyleConfig, function () {
        deferred.resolve(finalConfigItems);
      });
    }

    return deferred.promise;
  }


  return q.all(
    updateAndWriteConfig(files.GULP_CONFIG, builderProjectConfigTemplate, 'projectConfig'),
    updateAndWriteConfig(files.CUSTOM_CONFIG, builderUserConfigTemplate, 'userConfig'));
};