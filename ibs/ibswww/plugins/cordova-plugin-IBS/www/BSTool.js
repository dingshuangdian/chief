cordova.define("cordova-plugin-IBS.BSTool", function(require, exports, module) {
var exec = require('cordova/exec');

var BSTool = function () {};

BSTool.prototype.getNVInfo = function (arg0, success, error) {
    exec(success, error, "BSTool", "getNVInfo", [arg0]);
};


BSTool.prototype.backNavi = function (success, error) {
    exec(success, error, "BSTool", "backNavi", []);
};

BSTool.prototype.pushBSView = function (success, error) {
    exec(success, error, "BSTool", "pushBSView", []);
}

module.exports = new BSTool();
});
