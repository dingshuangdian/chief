//@ts-nocheck
import { Injectable } from '@angular/core';
import { Platform, LoadingController, ActionSheetController, Events } from 'ionic-angular';
import { WebSites } from './web-sites';
import { CsModal } from './cs-modal';
import { Md5 } from 'ts-md5';
declare let CMInfo: any, cordova: any, FileTransfer: any, PushInit: any, navigator: any, Camera: any;

@Injectable()
export class CsbzNave {

    // isNave: boolean = true;

    constructor(public platform: Platform,
        public websites: WebSites,
        public events: Events,
        private csModal: CsModal,
        public loadingCtrl: LoadingController,
        public actionSheetCtrl: ActionSheetController, ) {
    }

    pushInit() {
        if (!window["PushInit"]) {
            return
        }

        var pushInfo: any = {};

        PushInit.init(function (type) {
            if (type.channelType == "sys_jiguang") {
                pushInfo.pushTypeId = 1;
            } else if (type.channelType == "sys_emui") {
                pushInfo.pushTypeId = 11;
            } else if (type.channelType == "sys_miui") {
                pushInfo.pushTypeId = 12;
            }
        });

        var getRegistrationID = function () {
            PushInit.getUuid(onGetRegistrationID);
        };

        var onGetRegistrationID = function (data) {
            console.log("registrationID is " + data.pushTypeId);

            if (data.pushTypeId) {
                pushInfo.registerId = data.pushTypeId;

                // this.websites.httpPost('/CRUD/CRUD-U-APP-Push-register.do', {
                //     pushTypeId: pushInfo.pushTypeId,
                //     registerId: pushInfo.registerId
                // }).subscribe((res) => {
                //     console.log(res);
                // })

            } else {
                setTimeout(getRegistrationID, 1000);
            }
        };
        let $this = this;
        if (PushInit.getUserNotificationSettings) {
            PushInit.getUserNotificationSettings(function (Setting) {
                if (Setting > 0) {
                    getRegistrationID();
                } else {
                    $this.csModal.showAlert('重要的任务通知，即时掌握任务动态', () => {
                        PushInit.openSetingOfNotification()
                    }, false, '马上开启', false, '开启重要通知')
                    // if (typeof $config.notificationsPrompt == 'function') {
                    //     $config.notificationsPrompt(function () {
                    //         PushInit.openSetingOfNotification()
                    //     })
                    // } else {
                    //     this.csModal.showAlert('重要的任务通知，即时掌握任务动态', () => {
                    //         PushInit.openSetingOfNotification()
                    //     }, false, '马上开启', false, '开启重要通知')
                    // }
                }
            })
        } else {
            getRegistrationID();
        }

        pushInfo.mtImei = Md5.hashStr(CMInfo.uniqueId + "3").toString()

        // $net.addListener({
        //     onRequest: function (config) {
        //         config.data = config.data || {}
        //         config.data.mtImei = pushInfo.mtImei || '';
        //         config.data.registerId = pushInfo.registerId || '';
        //     }
        // })

        // this.websites.httpPost('/CRUD/CRUD-U-APP-Push-register.do', {
        //     systemId: 3,
        //     systemVerno: CMInfo.appVersion,
        //     mtVendor: CMInfo.factory,
        //     mtModel: CMInfo.device,
        //     osName: this.platform.is('ios') ? 'ios' : 'android',
        //     osVerno: CMInfo.sysVersion
        // }).subscribe();



        if (this.platform.is('ios')) {
            PushInit.setApplicationIconBadgeNumber(0);
        }
    }

    appUpdate(checkTag?) {
        if (!window["CMInfo"]) {
            return;
        }
        //this.updateInfo({ releaseNote: "看到你了", url: "http://47.106.65.158:9380/data/android/ETS.apk", versionTags: 1 });
        var urlsuffix = 'getAndroidVersion';

        if (this.platform.is('ios')) {
            urlsuffix = "getIOSVersion";
        }

        this.websites.httpPost(urlsuffix, { version: CMInfo.appVersion }, false).subscribe(res => {
            if (res == '' || res == null) {
                if (checkTag) {
                    this.csModal.showAlert("已是最新版本");
                };
            } else {
                this.updateInfo(res);
            }
        })
    }
    updateInfo(data) {
        var newVersionInfo = data;

        this.csModal.showAlert(newVersionInfo.releaseNote, () => {
            cordova.download.downloadStart({ "path": newVersionInfo.url, isClos: true }, (res) => {
                console.log(res);
            }, (error) => {
                console.log(error);
            })

        }, (newVersionInfo.versionTags & 1) <= 0, false, false, '版本更新')
    }
    downloadAPK(path) {
        let loading = this.loadingCtrl.create({ content: "正在下载..." });
        loading.present();
        var url = path //可以从服务端获取更新APP的路径
        var arr = url.split("/");
        var apkName = arr[arr.length - 1] || 'undefined';
        var targetPath = cordova.file.externalRootDirectory + "/Download/" + apkName;

        var fileTransfer = new FileTransfer();

        fileTransfer.download(url, targetPath, function (entry) {
            loading.dismiss();
            cordova.plugins.fileOpener2.open(
                targetPath,
                'application/vnd.android.package-archive', {
                    error: function (e) {
                        console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                    },
                    success: function () {

                    }
                }
            );
        }, function (err) {
            // alert('下载失败');
            loading.dismiss();
            this.csModal.showAlert("下载失败");

        });

        fileTransfer.onprogress = function (progressEvent) {
            if (progressEvent.lengthComputable) {
                var downloadProgress = (progressEvent.loaded / progressEvent.total) * 100;
                loading.setContent("正在下载：" + Math.floor(downloadProgress) + "%");

            }
        };

    }


    cameraPicture(callback, srcType?, allowEdit?) {

        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: srcType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: allowEdit ? true : false,
            saveToPhotoAlbum: srcType,
        }

        if (srcType) {
            options.sourceType = srcType
        }

        if (allowEdit) {
            options.quality = 100;
        }

        navigator.camera.getPicture(onSuccess, onFail, options);
        function onSuccess(imageData) {
            var imageInfo: any = {};
            imageInfo.imageSrc = "data:image/jpeg;base64," + imageData;
            imageInfo.imageBlob = convertBase64UrlToBlob(imageInfo.imageSrc);
            if (callback) {
                callback(imageInfo);
            }
        }

        function onFail(message) {

            var imageInfo: any = {};

            imageInfo.msg = message;

            if (callback) {
                callback(imageInfo);
            }
        }

        function convertBase64UrlToBlob(urlData) {

            var bytes = window.atob(urlData.split(',')[1]);

            var ab = new ArrayBuffer(bytes.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }

            return new Blob([ab], {
                type: 'image/jpeg'
            });
        }
    }

    selecPicture(callback, allowEdit?) {
        let actionSheet = this.actionSheetCtrl.create({
            title: '选择来源',
            buttons: [
                {
                    text: '拍照',
                    handler: () => {
                        this.cameraPicture(callback, Camera.PictureSourceType.CAMERA, allowEdit);
                    }
                }, {
                    text: '相册',
                    handler: () => {
                        this.cameraPicture(callback, Camera.PictureSourceType.PHOTOLIBRARY, allowEdit);
                    }
                }, {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                    }
                }
            ]
        });
        actionSheet.present();
    }



    carIdSacn(callBack) {
        cordova.ocrplateidsmart.ocrplateidSmartOpen((res) => {
            callBack(res)
        }, (error) => {
            console.log(error);
        })
    }


    isNave(number) {
        if (number == 0) {
            return true;
        } else {
            return false;
        }
    }

    goInsurance(plateNumber) {
        if (!plateNumber) {
            alert("车牌信息异常");
            return;
        }
        var no = plateNumber;
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            window['czbbb'].toInsurByNo("" + no);
        } else if (isiOS) {
            document.location.href = "czbbb://czbbb.toInsurByNo/" + encodeURI(no);
        } else {
            alert("手机端原生开发，请到app中查看使用");
        }
    }

    closewin() {
        var referrer = document.referrer;
        if (referrer === '') {
            window['czbbb'].nativeCloseWindow();
        } else {
            if (window['czbbb'] && window['czbbb'].nativeGoBack) {
                window['czbbb'].nativeGoBack();
            } else {
                history.go(-1);
            }
        }
    }

    scanner(callBack) {
        window['ocrCallback'] = function (fieldId, carNo) {
            // checkOcrCallback(fieldId, carNo);
            //saveStoreScanData(carNo);
            if (callBack) callBack(carNo)

        };

        window['czbbb'].ocr("search");
    }

    checkCarNo(v) {
        let isPlateNumber = false;
        v = v.trim();
        if (v.length < 9) {
            var prefix = v.substr(0, 1);
            var prefixs = "军京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领";
            if (/^[\u4e00-\u9fa5]+$/.test(prefix) && prefixs.indexOf(prefix) >= 0) {
                if (/^[a-zA-Z0-9\u6302\u8b66\u5b66\u6e2f\u6fb3]{6,9}/.test(v.substr(1))) {
                    isPlateNumber = true;
                } else {
                    isPlateNumber = false;
                }
            }
        }

        if (v == "无牌") {
            isPlateNumber = true;
        }

        return isPlateNumber;
    };

    checkTelephone(v) {
        //XXX 前端138****8888 也认为正确，后端再对个别处理
        var regphone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])(\*|\d){4}\d{4}$/;
        return regphone.test(v);
    };
    isCardID(cid) {
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

    ionDateTool(date, number?, interval = "d", month = "+") {

        if (number) {
            if (typeof number !== "string" && typeof number !== "number") {
                console.log("时间格式不对")
                return new date;
            }

            number = typeof number === "string" ? Number(number) : number;

            switch (interval) {
                case "y": {
                    if (month == "+") {
                        date.setFullYear(date.getFullYear() + number);
                    } else if (month == "-") {
                        date.setFullYear(date.getFullYear() - number);
                    }
                    break;
                }
                case "q": {
                    if (month == "+") {
                        date.setMonth(date.getMonth() + number * 3);
                    } else if (month == "-") {
                        date.setMonth(date.getMonth() - number * 3);
                    }
                    break;
                }
                case "m": {
                    if (month == "+") {
                        date.setMonth(date.getMonth() + number);
                    } else if (month == "-") {
                        date.setMonth(date.getMonth() - number);
                    }
                    break;
                }
                case "w": {
                    if (month == "+") {
                        date.setDate(date.getDate() + number * 7);
                    } else if (month == "-") {
                        date.setDate(date.getDate() - number * 7);
                    }
                    break;
                }
                case "d": {
                    if (month == "+") {
                        date.setDate(date.getDate() + number);
                    } else if (month == "-") {
                        date.setDate(date.getDate() - number);
                    }
                    break;
                }
                case "h": {
                    if (month == "+") {
                        date.setHours(date.getHours() + number);
                    } else if (month == "-") {
                        date.setHours(date.getHours() - number);
                    }
                    break;
                }
                case "m": {
                    if (month == "+") {
                        date.setMinutes(date.getMinutes() + number);
                    } else if (month == "-") {
                        date.setMinutes(date.getMinutes() - number);
                    }
                    break;
                }
                case "s": {
                    if (month == "+") {
                        date.setSeconds(date.getSeconds() + number);
                    } else if (month == "-") {
                        date.setSeconds(date.getSeconds() - number);
                    }
                    break;
                }
                default: {
                    if (month == "+") {
                        date.setDate(date.getDate() + number);
                    } else if (month == "-") {
                        date.setDate(date.getDate() - number);
                    }
                    break;
                }
            }
        }

        return date;
    }



}
