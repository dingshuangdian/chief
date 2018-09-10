#!/usr/bin/env node

var fs = require('fs');
var path = require('path')

var copy = function (src, dst) {
  //读取目录
  fs.readdir(src, function (err, paths) {
    console.log(paths)
    if (err) {
      throw err;
    }
    paths.forEach(function (path) {
      var _src = src + '/' + path;
      var _dst = dst + '/' + path;
      var readable;
      var writable;
      fs.stat(_src, function (err, st) {
        if (err) {
          throw err;
        }

        if (st.isFile()) {
          readable = fs.createReadStream(_src); //创建读取流
          writable = fs.createWriteStream(_dst); //创建写入流
          readable.pipe(writable);
        } else if (st.isDirectory()) {
          exists(_src, _dst, copy);
        }
      });
    });
  });
}


//判断目标目录是否存在，不存在就创建
var exists = function (src, dst, callback) {
  fs.stat(dst, function (err, stat) {
    if (err) {
      if (err.code == 'ENOENT') { //不存在，去创建
        fs.mkdir(dst, function () { //创建目录
          callback(src, dst)
        })
        return;
      }
      console.error(err);
      throw err;
    }
    if (stat.isDirectory()) {
      callback(src, dst); //存在
    }
  })
}

copy(path.resolve(__dirname, "../fastlaneInfo"), path.resolve(__dirname, "../../platforms/ios"))
