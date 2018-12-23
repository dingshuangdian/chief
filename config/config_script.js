#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var compile = require('es6-template-strings/compile');
var resolveToString = require('es6-template-strings/resolve-to-string');
function otherConfig() {
  var FILES = {
    SRC: "config/cordovaHooks/config.tpl.xml",
    DEST: "config.xml"
  };
    var env = process.env.NODE_ENV || 'dev';
    var envFile = 'src/environments/env.' + env + '.ts';
    var ROOT_DIR = path.resolve(__dirname, '../')
    var configFileFull = path.join(ROOT_DIR, envFile);
    var srcFileFull = path.join(ROOT_DIR, FILES.SRC);
    var destFileFull = path.join(ROOT_DIR, FILES.DEST);
    var configData = fs.readFileSync(configFileFull, 'utf8').toString().split('ENV =')[1];
    var config = JSON.parse(configData)['cordova'];
/**congfig */
  var templateData = fs.readFileSync(srcFileFull, 'utf8');
  var compiled = compile(templateData);
  var content = resolveToString(compiled, config);
  fs.writeFileSync(destFileFull, content);

    /**热更新 */
    fs.readFile(path.join(ROOT_DIR, 'cordova-hcp.json'), function (err, data) {
      if (err) {
        return console.error(err);
      }
      var content = data.toString(); //将二进制的数据转换为字符串
      content = JSON.parse(content); //将字符串转换为json对象
      content.content_url = config.hcp_content_url;
      console.log(content);
      var str = JSON.stringify(content);
      fs.writeFile(path.join(ROOT_DIR, 'cordova-hcp.json'), str, function (err) {
        if (err) {
          console.error(err);
        }
      })
    })
  }

  module.exports = otherConfig;
  //test