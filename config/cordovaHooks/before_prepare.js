#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var compile = require('es6-template-strings/compile');
var resolveToString = require('es6-template-strings/resolve-to-string');

var ROOT_DIR = path.resolve(__dirname, '../../')

var env = process.env.NODE_ENV || 'prod';
var envFile = 'src/environments/env.' + env + '.ts';

var FILES = {
  SRC: "config/cordovaHooks/config.tpl.xml",
  DEST: "config.xml"
};

console.log('hooks-start: before_prepare', 'envFile:' + envFile);

var srcFileFull = path.join(ROOT_DIR, FILES.SRC);
var destFileFull = path.join(ROOT_DIR, FILES.DEST);
var configFileFull = path.join(ROOT_DIR, envFile);

var templateData = fs.readFileSync(srcFileFull, 'utf8');
var configData = fs.readFileSync(configFileFull, 'utf8').toString().split('ENV =')[1];
var config = JSON.parse(configData)['cordova'];

var compiled = compile(templateData);
var content = resolveToString(compiled, config);

fs.writeFileSync(destFileFull, content);

console.log('hooks-end: before_prepare');
