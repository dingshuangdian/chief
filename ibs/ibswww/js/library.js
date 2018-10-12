(function(angular) {
    angular.module("ionicLibrary", ["ionicLibrary.plugin", "ionicLibrary.tool"]);
})(angular);

(function(angular) {

    "use strict";
    angular.module("ionicLibrary.plugin", [])

    .factory('LCamera', ['$q', function($q) {

        function convertBase64UrlToBlob(urlData) {

            var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte

            //处理异常,将ascii码小于0的转换为大于0
            var ab = new ArrayBuffer(bytes.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }

            return new Blob([ab], {
                type: 'image/png'
            });
        }

        return {
            getPictureWithType: function(sourceType) {
                var deferred = $q.defer();

                var options = {
                    destinationType: Camera.DestinationType.DATA_URL, //base64
                    sourceType: sourceType, //自己设置 1相机 0相册
                    targetWdith: null, //自己设置
                    targetHeight: null, //自己设置
                    saveToPhotoAlbum: sourceType, //自己设置
                    // mediaType: 0
                    allowEdit: false
                };
                if (device.platform != "Android") {
                    options.targetWdith = 300;
                    options.targetHeight = 300;
                } else {
                    options.targetWdith = 800;
                    options.targetHeight = 800;
                }

                navigator.camera.getPicture(function(imageData) {

                    var imageInfo = {};

                    imageInfo.imageSrc = "data:image/jpeg;base64," + imageData;

                    imageInfo.imageBlob = convertBase64UrlToBlob(imageInfo.imageSrc);

                    deferred.resolve(imageInfo);

                }, function(error) {
                    deferred.reject(error);
                }, options);


                return deferred.promise;
            }

        }

    }])

    .service('LGeolocation', function($q) {

        var currentPosition = {};
        var currentLocation = null;
        var placeInfo = {};

        return {
            getCurrentPosition: function() {
                var deferred = $q.defer();

                if (device.platform != "Android") {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {

                            // console.log('Latitude: ' + position.coords.latitude + '\n' +
                            // 	'Longitude: ' + position.coords.longitude + '\n' +
                            // 	'Altitude: ' + position.coords.altitude + '\n' +
                            // 	'Accuracy: ' + position.coords.accuracy + '\n' +
                            // 	'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                            // 	'Heading: ' + position.coords.heading + '\n' +
                            // 	'Speed: ' + position.coords.speed + '\n' +
                            // 	'Timestamp: ' + position.timestamp + '\n');



                            //转百度坐标
                            var x = position.coords.longitude;
                            var y = position.coords.latitude;
                            var ggPoint = new BMap.Point(x, y);
                            var convertor = new BMap.Convertor();
                            var geoc = new BMap.Geocoder();
                            var pointArr = [];
                            pointArr.push(ggPoint);
                            convertor.translate(pointArr, 1, 5, function(data) {
                                if (data.status == 0) {
                                    console.log('Latitude: ' + position.coords.latitude + '\n' +
                                        'Longitude: ' + position.coords.longitude + '\n' + "转化为百度坐标为：" + data.points[data.points.length - 1].lng + "," + data.points[data.points.length - 1].lat);

                                    currentPosition = data.points[data.points.length - 1];

                                    geoc.getLocation(currentPosition, function(rs) {
                                        var addComp = rs.addressComponents;
                                        console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);

                                        currentLocation = addComp;
                                        placeInfo.currentLocation = currentLocation;
                                        placeInfo.currentPosition = currentPosition;

                                        deferred.resolve(placeInfo);
                                    });


                                } else {
                                    deferred.reject('转百度坐标失败');
                                }
                            })
                        }, function(error) {
                            deferred.reject('code: ' + error.code + '\n' +
                                'message: ' + error.message + '\n');
                        });
                    } else {
                        deferred.reject('该浏览器不支持定位');
                    }
                } else {

                    baidu_location.getCurrentPosition(function(data) {

                        currentPosition.lng = data.lontitude;
                        currentPosition.lat = data.latitude;


                        var geoc = new BMap.Geocoder();
                        geoc.getLocation(new BMap.Point(data.lontitude, data.latitude), function(rs) {
                            if (rs) {
                                var addComp = rs.addressComponents;
                                console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                                currentLocation = addComp;
                            };

                            placeInfo.currentLocation = currentLocation;
                            placeInfo.currentPosition = currentPosition;
                            deferred.resolve(placeInfo);
                        });

                    }, function(error) {
                        deferred.reject(error);
                    });
                }

                return deferred.promise;
            },

            getPosition: function() {
                if (currentPosition) {
                    return currentPosition;
                }
            },

            getLocation: function() {
                if (currentLocation) {
                    return currentLocation;
                }
            }

        }
    })

    .factory('LVersionUpdate', ['$ionicPopup', '$ionicLoading', function($ionicPopup, $ionicLoading) {
        function downloadAPK(path) {
            $ionicLoading.show({
                template: "正在下载：0%"
            });

            var url = path //可以从服务端获取更新APP的路径

            var targetPath = cordova.file.externalRootDirectory + "/Download/IBS.apk";

            var fileTransfer = new FileTransfer();
            fileTransfer.download(url, targetPath, function(entry) {
                $ionicLoading.hide();
                cordova.plugins.fileOpener2.open(
                    targetPath,
                    'application/vnd.android.package-archive', {
                        error: function(e) {
                            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                        },
                        success: function() {

                        }
                    }
                );
                $ionicLoading.hide();
            }, function(err) {
                alert('下载失败');
                $ionicLoading.hide();
            });

            fileTransfer.onprogress = function(progressEvent) {
                if (progressEvent.lengthComputable) {
                    var downloadProgress = (progressEvent.loaded / progressEvent.total) * 100;
                    $ionicLoading.show({
                        template: "正在下载：" + Math.floor(downloadProgress) + "%"
                    });
                }
            };
        }
        return {
            updateInfo: function(data) {
                if (data) {
                    var newVersionInfo = data;
                    if ((newVersionInfo.versionTags & 1) > 0) {

                        $ionicPopup.show({
                            title: '版本更新',
                            template: '<div class="tc titleText" style="margin:10px;">' + newVersionInfo.releaseNote + '</div>',
                            buttons: [{
                                text: '<b>确定</b>',
                                type: 'button-positive',
                                onTap: function(e) {
                                    if (device.platform == "Android") {
                                        downloadAPK(newVersionInfo.path);
                                    } else {
                                        cordova.InAppBrowser.open(newVersionInfo.path, '_system', 'location=no');
                                    }
                                    e.preventDefault();
                                }
                            }, ]
                        });

                    } else {

                        var confirmPopup = $ionicPopup.confirm({
                            title: '版本更新',
                            template: '<div class="tc titleText" style="margin:10px;">' + newVersionInfo.releaseNote + '</div>',
                            buttons: [{
                                text: '取消'
                            }, {
                                text: '<b>确定</b>',
                                type: 'button-positive',
                                onTap: function(e) {
                                    if (device.platform == "Android") {
                                        downloadAPK(newVersionInfo.path);
                                    } else {
                                        cordova.InAppBrowser.open(newVersionInfo.path, '_system', 'location=no');
                                    }
                                }
                            }, ]
                        });
                    }
                };
            }
        }
    }])


    .factory('LJPUSH', ['$timeout', 'locals', function($timeout, locals) {


        var getRegistrationID = function() {
            window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
        };

        var onGetRegistrationID = function(data) {
            try {
                console.log("JPushPlugin:registrationID is " + data);

                if (data.length == 0) {
                    $timeout(getRegistrationID, 1000)
                }
            } catch (exception) {
                console.log(exception);
            }
        };


        var setLocalPushInfo = function(pushInfo) {
            var newsInfoForPush = locals.getObject('pushInfo');

            if (typeof newsInfoForPush != "undefined" && newsInfoForPush instanceof Array) {} else {
                newsInfoForPush = new Array();
            }

            newsInfoForPush.push(pushInfo);

            if (newsInfoForPush.length > 10) {
                newsInfoForPush.shift();
            }

            locals.setObject('pushInfo', newsInfoForPush);
        }


        var onTagsWithAlias = function(event) {
            try {
                console.log("onTagsWithAlias");
                var result = "result code:" + event.resultCode + " ";
                result += "tags:" + event.tags + " ";
                result += "alias:" + event.alias + " ";
                console.log(result);
            } catch (exception) {
                console.log(exception)
            }
        };

        var onOpenNotification = function(event) {
            try {
                var alertContent;
                if (device.platform == "Android") {
                    alertContent = event.extras;
                } else {
                    alertContent = event;
                }

                window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);

                setLocalPushInfo(alertContent)

                // alert("open Notification:" + JSON.stringify(event));
            } catch (exception) {
                console.log("JPushPlugin:onOpenNotification" + exception);
            }
        };

        var onReceiveNotification = function(event) {
            try {
                var alertContent;
                if (device.platform == "Android") {
                    alertContent = event.extras;
                } else {
                    alertContent = event;
                }
                window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);

                setLocalPushInfo(alertContent)
                    // alert(event);
            } catch (exception) {
                console.log(exception)
            }
        };


        return {
            //启动JPUSH
            init: function() {
                try {
                    window.plugins.jPushPlugin.init();
                    getRegistrationID();
                    if (device.platform != "Android") {
                        window.plugins.jPushPlugin.setDebugModeFromIos();
                        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                    } else {
                        window.plugins.jPushPlugin.setDebugMode(true);
                        //window.plugins.jPushPlugin.setStatisticsOpen(true);
                    }
                } catch (exception) {
                    console.log(exception);
                }


                document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);
                document.addEventListener("jpush.openNotification", onOpenNotification, false);
                document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
            }
        }
    }]);


})(angular);

(function(angular) {

    'use strict';
    angular.module("ionicLibrary.tool", [])
        .factory('LoadingView', ['$ionicLoading', '$timeout', function($ionicLoading, $timeout) {
            return {
                loadShow: function() {
                    $ionicLoading.show({
                        content: 'Loading', //内容：Loading为菊花
                        animation: 'fade-in', //动画
                        showBackdrop: true, //是否显示背景
                        maxWidth: 200,
                        showDelay: 0, //延迟时间
                        duration: 20000 //20秒后隐藏
                    });
                },

                showLoading: function(config) {
                    $ionicLoading.show(config);
                },

                loadShowNoTime: function() {
                    $ionicLoading.show({
                        template: '<p><ion-spinner icon="circles" class="spinner-balanced"></ion-spinner><span>正在上传···</span></p>',
                        showBackdrop: true, //是否显示背景
                        showDelay: 0 //延迟时间
                    });
                },
                loadShowLongTime: function(loadingText) {
                    $ionicLoading.show({
                        template: '<p><ion-spinner icon="circles" class="spinner-balanced" style="display:block;"></ion-spinner><span >' + loadingText + '</span></p>',
                        showBackdrop: true, //是否显示背景
                        maxWidth: 200,
                        showDelay: 0, //延迟时间
                    });
                },
                loadShowLongTime1: function(loadingText) {
                    $ionicLoading.show({
                        template: '<p><ion-spinner icon="circles" class="spinner-balanced" style="display:block;"></ion-spinner><span >' + loadingText + '</span></p>',
                        showBackdrop: false, //是否显示背景
                        maxWidth: 200,
                        showDelay: 20, //延迟时间
                    });
                },

                timeShow: function(msg) {
                    $ionicLoading.show({
                        template: msg,
                        duration: 2000,
                        noBackdrop: true
                    });
                },

                show: function(msg) {
                    $ionicLoading.show({
                        template: msg,
                        noBackdrop: true,
                        animation: 'fade-in',
                        duration: 20000
                    })
                },

                hide: function() {
                    $timeout(function() {
                        $ionicLoading.hide();
                    }, 100);
                }
            }
        }])


    .factory('locals', ['$window', function($window) {
        return {
            //存储单个属性  
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            //读取单个属性  
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            //存储对象，以JSON格式存储  
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            //读取对象  
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }

        }
    }])

})(angular);