(function(angular) {
    angular.module("iov", ["iov.utils", "iov.net", "iov.cache", "iov.validate"]);
    angular.module('iov').constant('$config', {});
})(angular);

(function(angular) {

    Date.prototype.format = function(format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                    date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }

    Date.prototype.addMonth = function(i) {
        var d = new Date(this.getTime())
        d.setMonth(d.getMonth() + Number(i));
        var month = d.getMonth() + 1;
        var day = d.getDate();

        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        return d.getFullYear() + '-' + month + '-' + day;

    }

    Date.prototype.addDays = function(days) {
        var ds = this.getTime() + (24 * 60 * 60 * 1000 * Number(days));
        return new Date(ds)
    }

    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
    String.prototype.ltrim = function() {
        return this.replace(/(^\s*)/g, "");
    }
    String.prototype.rtrim = function() {
        return this.replace(/(\s*$)/g, "");
    }
    String.prototype.startsWith = function(a) {
        return 0 === this.indexOf(a)
    }
    String.prototype.endsWith = function(a) {
        var b = this.length - a.length;
        return b >= 0 && this.lastIndexOf(a) === b
    }
})(angular);

(function(angular) {

    "use strict";
    var utils = angular.module("iov.utils", []);

    utils.factory("$utils", [function() {

        function md5(str) {
            if (null === str) {
                return null;
            }
            var xl;
            var rotateLeft = function(lValue, iShiftBits) {
                return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
            };
            var addUnsigned = function(lX, lY) {
                var lX4, lY4, lX8, lY8, lResult;
                lX8 = lX & 2147483648;
                lY8 = lY & 2147483648;
                lX4 = lX & 1073741824;
                lY4 = lY & 1073741824;
                lResult = (lX & 1073741823) + (lY & 1073741823);
                if (lX4 & lY4) {
                    return lResult ^ 2147483648 ^ lX8 ^ lY8;
                }
                if (lX4 | lY4) {
                    if (lResult & 1073741824) {
                        return lResult ^ 3221225472 ^ lX8 ^ lY8;
                    } else {
                        return lResult ^ 1073741824 ^ lX8 ^ lY8;
                    }
                } else {
                    return lResult ^ lX8 ^ lY8;
                }
            };
            var _F = function(x, y, z) {
                return x & y | ~x & z;
            };
            var _G = function(x, y, z) {
                return x & z | y & ~z;
            };
            var _H = function(x, y, z) {
                return x ^ y ^ z;
            };
            var _I = function(x, y, z) {
                return y ^ (x | ~z);
            };
            var _FF = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };
            var _GG = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };
            var _HH = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };
            var _II = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };
            var convertToWordArray = function(str) {
                var lWordCount;
                var lMessageLength = str.length;
                var lNumberOfWords_temp1 = lMessageLength + 8;
                var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - lNumberOfWords_temp1 % 64) / 64;
                var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                var lWordArray = new Array(lNumberOfWords - 1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - lByteCount % 4) / 4;
                    lBytePosition = lByteCount % 4 * 8;
                    lWordArray[lWordCount] = lWordArray[lWordCount] | str.charCodeAt(lByteCount) << lBytePosition;
                    lByteCount++;
                }
                lWordCount = (lByteCount - lByteCount % 4) / 4;
                lBytePosition = lByteCount % 4 * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | 128 << lBytePosition;
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            };
            var wordToHex = function(lValue) {
                var wordToHexValue = "",
                    wordToHexValue_temp = "",
                    lByte, lCount;
                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = lValue >>> lCount * 8 & 255;
                    wordToHexValue_temp = "0" + lByte.toString(16);
                    wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
                }
                return wordToHexValue;
            };
            var x = [],
                k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
                S12 = 12,
                S13 = 17,
                S14 = 22,
                S21 = 5,
                S22 = 9,
                S23 = 14,
                S24 = 20,
                S31 = 4,
                S32 = 11,
                S33 = 16,
                S34 = 23,
                S41 = 6,
                S42 = 10,
                S43 = 15,
                S44 = 21;
            x = convertToWordArray(str);
            a = 1732584193;
            b = 4023233417;
            c = 2562383102;
            d = 271733878;
            xl = x.length;
            for (k = 0; k < xl; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;
                a = _FF(a, b, c, d, x[k + 0], S11, 3614090360);
                d = _FF(d, a, b, c, x[k + 1], S12, 3905402710);
                c = _FF(c, d, a, b, x[k + 2], S13, 606105819);
                b = _FF(b, c, d, a, x[k + 3], S14, 3250441966);
                a = _FF(a, b, c, d, x[k + 4], S11, 4118548399);
                d = _FF(d, a, b, c, x[k + 5], S12, 1200080426);
                c = _FF(c, d, a, b, x[k + 6], S13, 2821735955);
                b = _FF(b, c, d, a, x[k + 7], S14, 4249261313);
                a = _FF(a, b, c, d, x[k + 8], S11, 1770035416);
                d = _FF(d, a, b, c, x[k + 9], S12, 2336552879);
                c = _FF(c, d, a, b, x[k + 10], S13, 4294925233);
                b = _FF(b, c, d, a, x[k + 11], S14, 2304563134);
                a = _FF(a, b, c, d, x[k + 12], S11, 1804603682);
                d = _FF(d, a, b, c, x[k + 13], S12, 4254626195);
                c = _FF(c, d, a, b, x[k + 14], S13, 2792965006);
                b = _FF(b, c, d, a, x[k + 15], S14, 1236535329);
                a = _GG(a, b, c, d, x[k + 1], S21, 4129170786);
                d = _GG(d, a, b, c, x[k + 6], S22, 3225465664);
                c = _GG(c, d, a, b, x[k + 11], S23, 643717713);
                b = _GG(b, c, d, a, x[k + 0], S24, 3921069994);
                a = _GG(a, b, c, d, x[k + 5], S21, 3593408605);
                d = _GG(d, a, b, c, x[k + 10], S22, 38016083);
                c = _GG(c, d, a, b, x[k + 15], S23, 3634488961);
                b = _GG(b, c, d, a, x[k + 4], S24, 3889429448);
                a = _GG(a, b, c, d, x[k + 9], S21, 568446438);
                d = _GG(d, a, b, c, x[k + 14], S22, 3275163606);
                c = _GG(c, d, a, b, x[k + 3], S23, 4107603335);
                b = _GG(b, c, d, a, x[k + 8], S24, 1163531501);
                a = _GG(a, b, c, d, x[k + 13], S21, 2850285829);
                d = _GG(d, a, b, c, x[k + 2], S22, 4243563512);
                c = _GG(c, d, a, b, x[k + 7], S23, 1735328473);
                b = _GG(b, c, d, a, x[k + 12], S24, 2368359562);
                a = _HH(a, b, c, d, x[k + 5], S31, 4294588738);
                d = _HH(d, a, b, c, x[k + 8], S32, 2272392833);
                c = _HH(c, d, a, b, x[k + 11], S33, 1839030562);
                b = _HH(b, c, d, a, x[k + 14], S34, 4259657740);
                a = _HH(a, b, c, d, x[k + 1], S31, 2763975236);
                d = _HH(d, a, b, c, x[k + 4], S32, 1272893353);
                c = _HH(c, d, a, b, x[k + 7], S33, 4139469664);
                b = _HH(b, c, d, a, x[k + 10], S34, 3200236656);
                a = _HH(a, b, c, d, x[k + 13], S31, 681279174);
                d = _HH(d, a, b, c, x[k + 0], S32, 3936430074);
                c = _HH(c, d, a, b, x[k + 3], S33, 3572445317);
                b = _HH(b, c, d, a, x[k + 6], S34, 76029189);
                a = _HH(a, b, c, d, x[k + 9], S31, 3654602809);
                d = _HH(d, a, b, c, x[k + 12], S32, 3873151461);
                c = _HH(c, d, a, b, x[k + 15], S33, 530742520);
                b = _HH(b, c, d, a, x[k + 2], S34, 3299628645);
                a = _II(a, b, c, d, x[k + 0], S41, 4096336452);
                d = _II(d, a, b, c, x[k + 7], S42, 1126891415);
                c = _II(c, d, a, b, x[k + 14], S43, 2878612391);
                b = _II(b, c, d, a, x[k + 5], S44, 4237533241);
                a = _II(a, b, c, d, x[k + 12], S41, 1700485571);
                d = _II(d, a, b, c, x[k + 3], S42, 2399980690);
                c = _II(c, d, a, b, x[k + 10], S43, 4293915773);
                b = _II(b, c, d, a, x[k + 1], S44, 2240044497);
                a = _II(a, b, c, d, x[k + 8], S41, 1873313359);
                d = _II(d, a, b, c, x[k + 15], S42, 4264355552);
                c = _II(c, d, a, b, x[k + 6], S43, 2734768916);
                b = _II(b, c, d, a, x[k + 13], S44, 1309151649);
                a = _II(a, b, c, d, x[k + 4], S41, 4149444226);
                d = _II(d, a, b, c, x[k + 11], S42, 3174756917);
                c = _II(c, d, a, b, x[k + 2], S43, 718787259);
                b = _II(b, c, d, a, x[k + 9], S44, 3951481745);
                a = addUnsigned(a, AA);
                b = addUnsigned(b, BB);
                c = addUnsigned(c, CC);
                d = addUnsigned(d, DD);
            }
            var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
            return temp.toLowerCase();
        }

        var base64 = function base64() {

            var PADCHAR = '=';

            var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

            function getbyte64(s, i) {
                var idx = ALPHA.indexOf(s.charAt(i));
                if (idx == -1) {
                    throw "Cannot decode base64";
                }
                return idx;
            }

            function decode(s) {
                // convert to string
                s = "" + s;
                var pads, i, b10;
                var imax = s.length;
                if (imax == 0) {
                    return s;
                }

                if (imax % 4 != 0) {
                    throw "Cannot decode base64";
                }

                pads = 0;
                if (s.charAt(imax - 1) == PADCHAR) {
                    pads = 1;
                    if (s.charAt(imax - 2) == PADCHAR) {
                        pads = 2;
                    }
                    // either way, we want to ignore this last block
                    imax -= 4;
                }

                var x = [];
                for (i = 0; i < imax; i += 4) {
                    b10 = (getbyte64(s, i) << 18) | (getbyte64(s, i + 1) << 12) |
                        (getbyte64(s, i + 2) << 6) | getbyte64(s, i + 3);
                    x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
                }

                switch (pads) {
                    case 1:
                        b10 = (getbyte64(s, i) << 18) | (getbyte64(s, i + 1) << 12) | (getbyte64(s, i + 2) << 6);
                        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
                        break;
                    case 2:
                        b10 = (getbyte64(s, i) << 18) | (getbyte64(s, i + 1) << 12);
                        x.push(String.fromCharCode(b10 >> 16));
                        break;
                }
                return x.join('');
            }

            function getbyte(s, i) {
                var x = s.charCodeAt(i);
                if (x > 255) {
                    throw "INVALID_CHARACTER_ERR: DOM Exception 5";
                }
                return x;
            }

            function encode(s) {
                if (arguments.length != 1) {
                    throw "SyntaxError: Not enough arguments";
                }

                var i, b10;
                var x = [];

                // convert to string
                s = "" + s;

                var imax = s.length - s.length % 3;

                if (s.length == 0) {
                    return s;
                }
                for (i = 0; i < imax; i += 3) {
                    b10 = (getbyte(s, i) << 16) | (getbyte(s, i + 1) << 8) | getbyte(s, i + 2);
                    x.push(ALPHA.charAt(b10 >> 18));
                    x.push(ALPHA.charAt((b10 >> 12) & 0x3F));
                    x.push(ALPHA.charAt((b10 >> 6) & 0x3f));
                    x.push(ALPHA.charAt(b10 & 0x3f));
                }
                switch (s.length - imax) {
                    case 1:
                        b10 = getbyte(s, i) << 16;
                        x.push(ALPHA.charAt(b10 >> 18) + ALPHA.charAt((b10 >> 12) & 0x3F) +
                            PADCHAR + PADCHAR);
                        break;
                    case 2:
                        b10 = (getbyte(s, i) << 16) | (getbyte(s, i + 1) << 8);
                        x.push(ALPHA.charAt(b10 >> 18) + ALPHA.charAt((b10 >> 12) & 0x3F) +
                            ALPHA.charAt((b10 >> 6) & 0x3f) + PADCHAR);
                        break;
                }
                return x.join('');
            }

            return {
                encode: encode,
                decode: decode
            };
        }();

        function uuid(len, radix) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [],
                i;
            radix = radix || chars.length;

            if (len) {
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            } else {
                var r;
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join('');
        }

        function getUrlParams(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }

        var utils = {
            md5: md5,
            base64encode: base64.encode,
            base64decode: base64.decode,
            uuid: uuid,
            getUrlParams: getUrlParams
        };

        return utils;
    }]);

})(angular);



(function(angular) {

    "use strict";

    function isInteger(text) {
        return angular.isNumber(text)
    }


    var cacheFactory = function(value, expiry) {
        if (!isInteger(expiry)) {
            expiry = 0;
        }
        expiry = expiry == 0 ? 0 : new Date().getTime() + Number(expiry);
        return {
            val: value,
            expiry: expiry,
            _d: 0
        };
    }


    var Cache = function(storage) {
        this.storage = storage;
        this.storageEvent = {};
    }

    Cache.prototype.addChangeListener = function(key, fun) {
        var $this = this;

        var cacheKey = "Change__" + key;
        $this.storageEvent[cacheKey] = fun;

        var storageHandle = function(e) {
            $this.trigger(e.key, e)
        };
        if (window.addEventListener) {
            window.addEventListener("storage", storageHandle, false);
        } else {
            window.attachEvent("onstorage", storageHandle);
        };

    }

    Cache.prototype.trigger = function(key, e) {
        var $this = this;
        var cacheKey = "Change__" + key;

        if (typeof this.storageEvent[cacheKey] == "function") {
            this.storageEvent[cacheKey]({
                key: key,
                value: $this.get(key)
            });
        }
    }

    Cache.prototype.getObject = function(key) {
        if (this.storage.getItem(key)) {
            var v = this.storage.getItem(key);
            if (typeof v != 'string') return v;
            if (v.startsWith("{") && v.endsWith("}")) {
                var c = JSON.parse(v);
                if (c._d == 0) {
                    if (c.expiry != 0 && c.expiry < new Date().getTime()) {
                        this.remove(key);
                        return undefined;
                    }
                    return c;
                }
            }
        }
    }

    Cache.prototype.setObject = function(key, value) {
        this.storage.setItem(key, JSON.stringify(value));
        this.trigger(key)
    }

    Cache.prototype.set = function(key, value, expiry) {
        this.setObject(key, cacheFactory(value, expiry))
    }

    Cache.prototype.get = function(key) {
        var v = this.getObject(key);
        if (v != undefined) {
            return v.val;
        }
    }

    Cache.prototype.remove = function(key) {
        var result = this.storage.removeItem(key);
        this.trigger(key)
        return result;
    }

    Cache.prototype.incr = function(key, value, expiry) {
        if (!isInteger(value)) {
            value = 1;
        }
        if (!isInteger(expiry)) {
            expiry = 0;
        }
        var v = this.getObject(key);
        if (v != undefined) {
            v.val += Number(value);
            v.expiry += Number(expiry);
        } else {
            v = cacheFactory(value, expiry);
        }
        this.setObject(key, v);
        return v.val;
    }

    Cache.prototype.decr = function(key, value, expiry) {
        if (!isInteger(value)) {
            value = 1;
        }
        if (!isInteger(expiry)) {
            expiry = 0;
        }
        var v = this.getObject(key);
        if (v != undefined) {
            v.val -= Number(value);
            v.expiry += Number(expiry);
        } else {
            v = cacheFactory(-value, expiry);
        }
        this.setObject(key, v);
        return v.val;
    }

    Cache.prototype.contains = function() {
        return this.storage.getItem(key) != null
    }

    Cache.prototype.clearAll = function() {
        this.storage.clear();
    }

    Cache.prototype.destroy = function() {
        for (var i = 0; i < this.storage.length; i++) {
            this.getObject(this.storage.key(i));
        }
    }
    Cache.prototype.getKey = function(prefix) {
        var itemList = {}
        for (var i = 0; i < this.storage.length; i++) {
            var key = this.storage.key(i)
            if (prefix) {
                if (key.match(/^TABLE_CFG_\d+/)) itemList[key] = key
            } else {
                itemList[key] = key
            }
        }
        return itemList
    }

    angular.module('iov.cache', []).provider('$localCache', function() {
        this.$get = function() {
            return new Cache(window.localStorage)
        }
    }).provider('$sessionCache', function() {
        this.$get = function() {
            return new Cache(window.sessionStorage)
        }
    });


})(angular);

(function(angular) {

    'use strict';


    function $net($q, $http, $httpParamSerializerJQLike) {

        var osTags = {
            pc: 1,
            mobile: 2,
            android: 4,
            ios: 8
        }

        var _os = 0
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            _os = _os | osTags.ios | osTags.mobile
        } else if (/(Android|Adr)/i.test(navigator.userAgent)) {
            _os = _os | osTags.android | osTags.mobile
        } else {
            _os = _os | osTags.pc
        };

        this.extend = function(obj1, obj2) {
            obj1 = obj1 || {};
            obj2 = obj2 || {};

            var result = {};
            angular.extend(result, obj1);

            for (var key in obj2) {
                if (result[key]) {
                    if (typeof result[key] == 'object') {
                        obj2[key] = obj2[key] || {};
                        angular.extend(obj2[key], result[key])
                    }
                }
                result[key] = obj2[key]
            }

            return result;
        }

        this.defaults = {
            data: {
                _os: _os
            }
        }

        this.config = function(config) {
            this.defaults = this.extend(this.defaults, config)
        }

        this.requestHandle = function(config) {
            angular.extend(config, this.extend(this.defaults, config))

            if (this.defaults.onRequest) {
                this.defaults.onRequest(config);
            }
        }

        this.request = function(config) {
            var deferred = $q.defer();
            var $this = this;

            $http(config).then(function successCallback(response) {
                if ($this.defaults.onResponse && $this.defaults.onResponse(config, response)) {
                    return;
                }

                deferred.resolve(response.data);
            }, function errorCallback(response) {
                if ($this.defaults.onResponseError && $this.defaults.onResponseError(config, response)) {
                    return;
                }

                deferred.reject(response)
            });

            return deferred.promise;
        }

        this.get = function(url, data, config) {

            config = config || {}

            config.reqType = 'get'
            config.method = config.reqType
            config.url = url
            config.data = data

            this.requestHandle(config)
            config.params = config.data

            return this.request(config);
        }

        this.post = function(url, data, config) {

            config = config || {}

            config.reqType = 'post'
            config.method = config.reqType
            config.url = url
            config.data = data

            if (!config.transformRequest) {
                config.transformRequest = function(data) {
                    return $httpParamSerializerJQLike(data);
                }
            }

            config.headers = config.headers || {}
            if (!config.headers['Content-Type']) {
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }

            this.requestHandle(config)

            return this.request(config);
        }

        this.upload = function(url, data, config) {
            config = config || {}

            config.reqType = 'upload'
            config.method = 'post'
            config.url = url
            config.data = data
            config.FormData = new FormData()

            this.requestHandle(config)

            config.headers = config.headers || {}
            config.headers['Content-Type'] = undefined;
            config.transformRequest = angular.identity;

            var formData = config.FormData ? config.FormData : new FormData();

            for (var key in config.data) {
                var val = config.data[key];

                if (val && val.hasOwnProperty('__uploadObject')) {
                    formData.append(key, val.file);

                    if (val.fileName)
                        formData.append(key + '_name', val.fileName);

                    continue;
                }

                formData.append(key, val);

            }

            config.data = formData;
            return this.request(config);
        }

        function uploadObjectBuild(file, fileName) {
            return {
                file: file,
                fileName: fileName,
                __uploadObject: true
            }
        }

        this.getFileById = function(id, fileName) {
            return uploadObjectBuild(document.querySelector('#' + id).files[0], fileName)
        }

        this.getFileByBase64 = function(data, fileName, isSplitHead, fileType) {

            if (isSplitHead) {
                data = data.split(',')[1]
            }

            var bytes = window.atob(data);
            var ab = new ArrayBuffer(bytes.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }

            var fType = {}
            if (fileType) {
                fType.type = fileType
            }

            return uploadObjectBuild(new Blob([ab], fType), fileName);
        }


        this.queue = function() {
            return new NetQueue(this, $q)
        }

    }

    var NetQueue = function($net, $q) {
        this.requestQueue = [];
        this.$net = $net;
        this.$q = $q;
        this.$index = 0;
    }

    NetQueue.prototype.request = function(request) {
        var $this = this;

        this.$net[request.method](request.url, request.data, request.config).then(
            function(success) {
                request.requestStatus = 2
                request.response = success
                $this.digest(request)
            },
            function(error) {
                request.requestStatus = 4
                request.response = error
                $this.digest(request)
            })

    }

    NetQueue.prototype.append = function(method, url, data, config) {
        var deferred = this.$q.defer();

        var index = this.requestQueue.length;
        this.requestQueue.push({
            method: method,
            url: url,
            data: data,
            config: config,
            deferred: deferred,
            index: index,
            requestStatus: -1,
            response: null
        })

        return deferred.promise;
    }

    NetQueue.prototype.get = function(url, data, config) {
        return this.append('get', url, data, config)
    }

    NetQueue.prototype.post = function(url, data, config) {
        return this.append('post', url, data, config)
    }

    NetQueue.prototype.upload = function(url, data, config) {
        return this.append('upload', url, data, config)
    }

    NetQueue.prototype.invoke = function() {
        for (var i in this.requestQueue) {
            this.request(this.requestQueue[i])
        }
    }

    NetQueue.prototype.digest = function(request) {
        if (!request || request.requestStatus < 0) {
            return;
        }

        if (request.index == this.$index) {
            if (request.requestStatus == 2) {
                request.deferred.resolve(request.response);
            } else if (request.requestStatus == 4) {
                request.deferred.reject(request.response);
            }

            this.digest(this.requestQueue[++this.$index])
        }
    }

    angular.module('iov.net', []).service('$net', $net);


})(angular);

(function(angular) {
    "use strict";
    angular.module("iov.validate", []).service("$validate", [function() {

        /** 
         * 检验18位身份证号码（15位号码可以只检测生日是否正确即可） 
         * @author wolfchen 
         * @param cid 18为的身份证号码 
         * @return Boolean 是否合法 
         **/

        this.isCardID = function(cid) {
            var arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //加权因子  
            var arrValid = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2]; //校验码  
            if (/^\d{17}\d|x$/i.test(cid)) {
                var sum = 0,
                    idx;
                for (var i = 0; i < cid.length - 1; i++) {
                    // 对前17位数字与权值乘积求和    
                    sum += parseInt(cid.substr(i, 1), 10) * arrExp[i];
                }
                // 计算模（固定算法）  
                idx = sum % 11;
                // 检验第18为是否与校验码相等  
                return arrValid[idx] == cid.substr(17, 1).toUpperCase();
            } else {
                return false;
            }
        }

        this.isPhoneNumber = function(phoneNum) {
            var reg = /^1[0-9]{10}$/;
            return reg.test(phoneNum);
        }

    }]);
})(angular);