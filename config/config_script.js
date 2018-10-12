#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

function otherConfig() {
    var env = process.env.NODE_ENV || 'dev';
    var envFile = 'src/environments/env.' + env + '.ts';
    var ROOT_DIR = path.resolve(__dirname, '../')
    var configFileFull = path.join(ROOT_DIR, envFile);
    var configData = fs.readFileSync(configFileFull, 'utf8').toString().split('ENV =')[1];
    var config = JSON.parse(configData)['cordova'];
  
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