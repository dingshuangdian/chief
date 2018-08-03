#!/usr/bin/env node

var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path')
var child_process = require('child_process');

var configChange = require('./config_script');


var hot_build = function (cmd, cmdArr, callback) {
  configChange();
  var ionic_build_process = child_process.spawn(cmd, cmdArr);
  ionic_build_process.stdout.on('data', function (data) {
    console.log("" + data);
  });
  ionic_build_process.stderr.on('data', function (data) {
    console.log("" + data);
  });
  ionic_build_process.on('close', function (code) {
    console.log('ionic build close，code: ' + code);

    child_process.exec('cordova-hcp build', function (error, stdout, stderr) {
      if (error) {
        console.error('error: ' + error);
        return;
      } 
      if (stderr) {
        console.log(chalk.yellow('stderr: ' + stderr));
      }
      console.log('stdout: ' + stdout);
      callback();
    })
  });
}

var mkdirsDir = function (dirname, callback) {
  fs.open(dirname, 'r', (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        mkdirsDir(path.dirname(dirname), function () {
          fs.mkdir(dirname, callback);
        });
        return;
      }
      throw err;
    } else {
      callback();
    }
  });
}

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

var exists = function (src, dst, callback) {
  //测试某个路径下文件是否存在
  fs.exists(dst, function (exists) {
    if (exists) { //不存在
      callback(src, dst);
    } else { //存在
      fs.mkdir(dst, function () { //创建目录
        callback(src, dst)
      })
    }
  })
}



program
  .command('hcp [env]')
  .description("热更新打包")
  .option('-p, --prod', '生产环境')
  .option('-t, --test', '测试环境')
  .option('-O, --optimize', '设置ionic生产环境和预编译等操作')
  .action(function (env, options) {

    var cmd = process.platform === 'win32' ? 'ionic.cmd' : 'ionic',
      cmdArr = ['build'];
    process.env.NODE_ENV = "dev";

    if (env) {
      process.env.NODE_ENV = env;
    }

    if (options.prod) {
      process.env.NODE_ENV = 'prod';
      cmdArr = ["build", "--prod", "--aot", "--minifyjs", "--minifycss", "--optimizejs"];
    } else if (options.test) {
      process.env.NODE_ENV = 'test';
      cmdArr = ["build", "--prod", "--aot", "--minifyjs", "--minifycss", "--optimizejs"];
    }

    if (options.optimize || env == "prod") {
      cmdArr = ["build", "--prod", "--aot", "--minifyjs", "--minifycss", "--optimizejs"];
    }

    if (!fs.existsSync('src/environments/env.' + process.env.NODE_ENV + '.ts')) {
      console.log(chalk.red('\n' + 'src/environments/env.' + process.env.NODE_ENV + '.ts' + ' does not exist!'));
      process.exit(1);
    }

    hot_build(cmd, cmdArr, function () {

      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();
      var time = '_' + month + '_' + day + '_' + hour + '_' + minute;

      var rootPath = path.resolve(__dirname, '../');
      var rootPathArr = rootPath.split(process.platform === 'win32' ? '\\' : '/');
      var rootName = rootPathArr[rootPathArr.length - 1];


      mkdirsDir(path.resolve(__dirname, '../hcp_build', rootName + '_' + process.env.NODE_ENV + time), function () {
        exists(path.resolve(__dirname, '../www'), path.resolve(__dirname, '../hcp_build', rootName + '_' + process.env.NODE_ENV + time, 'www'), copy);
      });


    });
  });


program
  .command('nav <platform>')
  .description("app打包")
  .option('-b, --beta', 'beta包')
  .option('-r, --release', '正式包（上架应用市场、appStore）')
  .option('-e, --enterprise', '企业包（仅ios）')
  .action(function (platform, options) {

    var method = "beta";

    if (options.release) {
      method = "release";
    } else if (options.beta) {
      method = "beta";
    }


    // if (options.release) {
    //   method = "release";
    // } else {
    //   if (options.beta) {
    //     method = "beta";
    //   } else if (options.enterprise) {
    //     method = "enterprise";
    //   }
    // }

    if (platform === "ios") {
      process.chdir('./platforms/ios');

      child_process.exec('fastlane ' + method, function (error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
          console.log('Error code: ' + error.code);
          return;
        }
        if (stderr) {
          console.log(chalk.yellow('stdout: ' + stdout));
        }
        console.log('stdout: ' + stdout);
      });
    } else {
      child_process.exec('cordova build android --release', function (error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
          console.log('Error code: ' + error.code);
          return;
        }
        if (stderr) {
          console.log(chalk.yellow('stdout: ' + stdout));
        }
        console.log('stdout: ' + stdout);
      });
    }

  })
  .on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    $ build nav ios -r       App Store包');
    console.log('    $ build nav ios -b       测试包');
    console.log('    $ build nav android      安卓包');
    console.log('');
  });;


program.parse(process.argv);





// program
//   .command('hcp')
//   .description("热更新打包")
//   .option('-p, --prod', '生产')
//   .action(function (options) {
//     co(function* () {
//       var username = yield prompt('username: ');
//       var password = yield prompt.password('password: ');
//     })
//   })
