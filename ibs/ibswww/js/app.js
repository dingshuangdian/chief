// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives', 'iov', 'ionic-datepicker', 'ionicLibrary', 'iov-webui-select'])

.run(function($ionicPlatform, $net, $localCache, LVersionUpdate, LoadingView, LJPUSH, ModalService, $rootScope, $ionicHistory, autoLogin, $state) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(true);
            //延迟splash screnn 隐藏时间,不然会有短暂的白屏出现  
            navigator.splashscreen.hide();
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }

        try {
            $rootScope.IBSpj = 0
            cordova.BSTool.getNVInfo("zmInfo", function(data) {
                if (!data.home) {
                    // window.location.href = "#/anticipateProfit"
                    $ionicHistory.nextViewOptions({
                        disableBack: true,
                        disableAnimate: true,
                        historyRoot: true
                      });
                      $state.go('anticipateProfit');
                }

                autoLogin.action(data.tokenId);

            });
        } catch (exception) {
            $rootScope.IBSpj = 1
            if (!$localCache.get('tokenId')) {
                ModalService.show('templates/modal/loginModel.html', 'LoginCtrl', true);
            }

            LJPUSH.init();
            checkVersion();
        }

    });

    var versionNum;

    var loadingData = {
        content: 'Loading', //内容：Loading为菊花
        animation: 'fade-in', //动画
        showBackdrop: true, //是否显示背景
        maxWidth: 200,
        showDelay: 0, //延迟时间
    };
    $net.config({
        onRequest: function(config) {
            if (config.isLoading) {
                var data = {};
                angular.extend(data, loadingData);
                LoadingView.showLoading(data);
            }
            config.data.tokenId = $localCache.get('tokenId');
            config.url = config.url.indexOf('http') == -1 ? $cfg.api + config.url : config.url;
            config.data._v = versionNum || '';
        },
        onResponse: function(config, response) {
            if (config.isLoading) {
                LoadingView.hide();
            }
            if (response.data.msg == 'NOT_LOGIN') {
                $localCache.remove('storeInfo');
                if ($rootScope.IBSpj) {
                    $localCache.remove('tokenId');
                    ModalService.show('templates/modal/loginModel.html', 'LoginCtrl');
                    $rootScope.loginTag = false;
                    window.plugins.jPushPlugin.setTagsWithAlias([], '');
                    if ($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    }
                } else {
                    if (device.platform != "Android") {
                        cordova.BSTool.backNavi();
                    } else {
                        navigator.app.exitApp();
                    }
                }

            }
        },
        onResponseError: function(config) {
            if (config.isLoading) {
                LoadingView.hide();
                userFactory.showAlert($ionicPopup, $scope, '响应超时，请检查网络！');


            }
        }
    })

    function checkVersion() {
        var versionUrl;
        cordova.getAppVersion.getVersionCode().then(function(version) {
            versionNum = version;
            if (device.platform == "Android") {
                versionUrl = '/CRUD/CRUD-Q-IBS-Android-App-checkVersion.do';
            } else {
                versionUrl = '/CRUD/CRUD-Q-IBS-Ios-App-checkVersion.do';
            }
            $net.post(versionUrl, {
                version: version
            }).then(function(res) {
                LVersionUpdate.updateInfo(res.result);
            })
        });
        cordova.getAppVersion.getVersionNumber().then(function(version) {
            $rootScope.versionNumber = version;
        })
    }

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $localCacheProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        .state('BSApp', {
        url: '/BSApp',
        views: {
            'BSApp': {
                templateUrl: 'templates/BSApp.html',
                controller: 'BSAppCtrl'
            }
        }
    })

    .state('allExpireData', {
        url: '/allExpireData',
        views: {
            'BSApp': {
                templateUrl: 'templates/allExpireData.html',
                controller: 'AllExpireDataCtrl'
            }
        }
    })

    .state('login', {
        url: '/login',
        views: {
            'BSApp': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            }
        }
    })

    .state('aboutChief', {
        url: '/aboutChief',
        views: {
            'BSApp': {
                templateUrl: 'templates/aboutChief.html'
            }
        }
    })

    .state('changePersonalMessage', {
        url: '/changePersonalMessage',
        views: {
            'BSApp': {
                templateUrl: 'templates/changePersonalMessage.html',
                controller: 'ChangePersonalMessageCtrl'
            }
        }
    })

    .state('selectInsurance', {
            url: '/BSApp/selectInsurance',
            views: {
                'BSApp': {
                    templateUrl: 'templates/selectInsurance.html',
                    controller: 'selectInsuranceCtrl'
                }
            },
            params: {
                carownerMobile: null,
                quoteTypeId: null,
                insuranceCompanyId: null,
                insuredIdCardPhotoImg: null,
                insuredIdCardPhotoImg_name: null,
                cityCode: null,
                drivingLicenseImg: null,
                drivingLicenseImg_name: null,
                carInvoicePhotoImg: null,
                carInvoicePhotoImg_name: null,
                carbodyPhotoImg1: null,
                carbodyPhotoImg1_name: null,
                carbodyPhotoImg2: null,
                carbodyPhotoImg2_name: null,
                carbodyPhotoImg3: null,
                carbodyPhotoImg3_name: null,
                carbodyPhotoImg4: null,
                carbodyPhotoImg4_name: null,
                carvinPhotoImg: null,
                carvinPhotoImg_name: null,
                otherPhotoImg1: null,
                otherPhotoImg1_name: null,
                otherPhotoImg2: null,
                otherPhotoImg2_name: null,
                otherPhotoImg3: null,
                otherPhotoImg3_name: null,
                router: null,
                licenseNo: null,
                agentName: null,
                userId: null,
                orderId: null
            }
        })
        .state('selectModel', {
            url: '/BSApp/selectInsurance/selectModel',
            views: {
                'BSApp': {
                    templateUrl: 'templates/selectModel.html',
                    controller: 'selectModelCtrl'
                }
            },
            params: {
                modleName: null,
                licenseNo: null,
                autoMoldcode: null
            }
        })

    .state('backDetails', {
        url: '/BSApp/backDetails',
        views: {
            'BSApp': {
                templateUrl: 'templates/backDetails.html',
                controller: 'BackDetailsfoCtrl'
            }
        },
        params: {
            title: null,
            btnFlag: null,
            orderId: null
        }
    })

    .state('underwritingDetails', {
        url: '/BSApp/underwritingDetails',
        views: {
            'BSApp': {
                templateUrl: 'templates/underwritingDetails.html',
                controller: 'BackDetailsfoCtrl'
            }
        },
        params: {
            title: null,
            btnFlag: null,
            orderId: null
        }
    })

    .state('sureDetails', {
        url: '/BSApp/sureDetails',
        views: {
            'BSApp': {
                templateUrl: 'templates/sureDetails.html',
                controller: 'BackDetailsfoCtrl'
            }
        },
        params: {
            title: null,
            btnFlag: null,
            orderId: null
        }
    })

    .state('showPicture', {
        url: 'showPicture',
        views: {
            'BSApp': {
                templateUrl: 'templates/showPicture.html',
                controller: 'PicturesCtrl'
            }
        },
        params: {
            msg: null,
            typeId: null
        }
    })

    .state('selectCompany', {
        url: '/BSApp/selectCompany',
        views: {
            'BSApp': {
                templateUrl: 'templates/selectCompany.html',
                controller: 'selectCompanyCtrl'
            }
        },
        params: {
            carownerMobile: null,
            quoteTypeId: null,
            insuranceCompanyId: null,
            insuredIdCardPhotoImg: null,
            insuredIdCardPhotoImg_name: null,
            cityCode: null,
            drivingLicenseImg: null,
            drivingLicenseImg_name: null,
            carInvoicePhotoImg: null,
            carInvoicePhotoImg_name: null,
            carbodyPhotoImg1: null,
            carbodyPhotoImg1_name: null,
            carbodyPhotoImg2: null,
            carbodyPhotoImg2_name: null,
            carbodyPhotoImg3: null,
            carbodyPhotoImg3_name: null,
            carbodyPhotoImg4: null,
            carbodyPhotoImg4_name: null,
            carvinPhotoImg: null,
            carvinPhotoImg_name: null,
            otherPhotoImg1: null,
            otherPhotoImg1_name: null,
            otherPhotoImg2: null,
            otherPhotoImg2_name: null,
            otherPhotoImg3: null,
            otherPhotoImg3_name: null,
            router: null,
            licenseNo: null,
            agentName: null,
            userId: null,
            orderId: null,
            list: null
        }
    })

    .state('uploadData', {
        url: '/BSApp/uploadData/:orderId',
        views: {
            'BSApp': {
                templateUrl: 'templates/uploadData.html',
                controller: 'uploadDataCtrl'
            }
        }
    })

    .state('fillInfo', {
        url: '/BSApp/fillInfo',
        views: {
            'BSApp': {
                templateUrl: 'templates/fillInfo.html',
                controller: 'fillInfoCtrl'
            }
        },
        params: {
            orderId: null
        }
    })

    .state('insurancePolicyPay', {
        url: '/BSApp/insurancePolicyPay/:orderId',
        views: {
            'BSApp': {
                templateUrl: 'templates/insurancePolicyPay.html',
                controller: 'insurancePolicyPayCtrl'
            }
        }
    })

    .state('quotedPrice', {
        url: '/BSApp/quotedPrice/:cityCode/:agentName/:userId',
        views: {
            'BSApp': {
                templateUrl: 'templates/quotedPrice.html',
                controller: 'quotedPriceCtrl'
            }
        }
    })

    .state('pleasantPrompt', {
        url: '/BSApp/selectInsurance/pleasantPrompt',
        views: {
            'BSApp': {
                templateUrl: 'templates/pleasantPrompt.html',
                controller: 'pleasantPromptCtrl'
            }
        }
    })

    .state('insuranceDetail', {
        url: '/BSApp/insuranceDetail',
        views: {
            'BSApp': {
                templateUrl: 'templates/insuranceDetail.html',
                controller: 'insuranceDetailCtrl'
            }
        },
        params: {
            titel: null,
            btnMessgage: null,
            licenseNo: null
        }
    })

    .state('wxPrompt', {
        url: '/BSApp/insuranceDetail/wxPrompt',
        views: {
            'BSApp': {
                templateUrl: 'templates/wxPrompt.html',
                controller: 'wxPromptCtrl'
            }
        }
    })

    .state('anticipateProfit', {
        url: '/anticipateProfit',
        views: {
            'BSApp': {
                templateUrl: 'templates/anticipateProfit.html',
                controller: 'anticipateProfitCtrl'
            }
        }
    })

    .state('profitDetail', {
        url: '/anticipateProfit/profitDetail',
        views: {
            'BSApp': {
                templateUrl: 'templates/profitDetail.html',
                controller: 'BackDetailsfoCtrl'
            }
        },
        params: {
            orderId: null
        }
    })

    .state('insureProgress', {
        url: '/insureProgress',
        views: {
            'BSApp': {
                templateUrl: 'templates/insureProgress.html',
                controller: 'insureProgressCtrl'
            }
        },
        params: {
            num: null
        }
    })

    .state('exceptionCause', {
        url: '/exceptionCause',
        views: {
            'BSApp': {
                templateUrl: 'templates/exceptionCause.html',
                controller: 'exceptionCauseCtrl'
            }
        }
    })

    .state('plccOfferDetails', {
        url: '/plccOfferDetails',
        // url: '/plccOfferDetails/:router/:licenseNo/:quoteGroup/:list/:insuranceCompanyList/:carVin/:insureAgentUname',
        views: {
            'BSApp': {
                templateUrl: 'templates/plccOfferDetails.html',
                controller: 'plccOfferDetailsCtrl'
            }
        },
        params: {
            router: null,
            licenseNo: null,
            insureAgentUname: null,
            quoteGroup: null,
            carVin: null,
            list: null
        }
    })

    .state('photographSample', {
        url: '/photographSample',
        views: {
            'BSApp': {
                templateUrl: 'templates/photographSample.html',
                controller: 'photographSampleCtrl'
            }
        }
    })

    .state('supplementaryInfo', {
        url: '/BSApp/supplementaryInfo/:orderId',
        views: {
            'BSApp': {
                templateUrl: 'templates/supplementaryInfo.html',
                controller: 'supplementaryInfoCtrl'
            }
        }
    })

    .state('newsCentre', {
        url: '/BSApp/newsCentre',
        views: {
            'BSApp': {
                templateUrl: 'templates/newsCentre.html',
                controller: 'newsCentreCtrl'
            }
        }
    })

    .state('deliveryAddress', {
        url: '/BSApp/deliveryAddress',
        views: {
            'BSApp': {
                templateUrl: 'templates/deliveryAddress.html',
                controller: 'deliveryAddressCtrl'
            }
        },
        params: {
            index: null
        }
    })

    .state('addOrEditDeliveryAddress', {
        url: '/BSApp/deliveryAddress/addOrEditDeliveryAddress',
        views: {
            'BSApp': {
                templateUrl: 'templates/addOrEditDeliveryAddress.html',
                controller: 'addOrEditDeliveryAddressCtrl'
            }
        },
        params: {
            data: null
        }
    })

    // if (!$localCacheProvider.$get().get('tokenId')) {
    //     $urlRouterProvider.otherwise('/app/loginPopup');
    // } else {
    //     $urlRouterProvider.otherwise('/app/home');
    // }


    $urlRouterProvider.otherwise('/BSApp');
})



.config(function(ionicDatePickerProvider) {
    var datePickerObj = {
        inputDate: new Date(),
        titleLabel: 'Select a Date',
        setLabel: '确定',
        todayLabel: 'Today',
        closeLabel: '取消',
        mondayFirst: false,
        weeksList: ["日", "一", "二", "三", "四", "五", "六"],
        monthsList: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        templateType: 'popup',
        from: new Date(2012, 8, 1),
        to: new Date(2018, 8, 1),
        showTodayButton: false,
        dateFormat: 'dd MMMM yyyy',
        closeOnSelect: false,
        disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
    //  $ionicConfigProvider.tabs.position('bottom');
})