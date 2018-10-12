angular.module('starter.controllers', [])

//首页
.controller('BSAppCtrl', function($scope, $state, $net, $validate, userFactory, $localCache, $ionicPopup, $ionicPlatform, $filter, locals, $rootScope, ModalService) {
    $scope.testTag = false;
    $scope.data = {
        licenseNo : ''
    };
    $scope.selectedLicense = '';

    document.addEventListener("deviceready", function() {
        if (cordova.BSTool) {
            cordova.BSTool.getNVInfo("zmInfo", function(data) {
                if (data.carNum) {
                   $scope.selectedLicense = data.carNum.substring(0,1); 
                   $scope.data.licenseNo = data.carNum.substring(1);
                }

            });
         }
    })
    

    // if ($cfg.api.indexOf('http://ibs.chiefchain.com') == -1) {
    //     var arr = $cfg.api.split('/');
    //     $scope.testTag = arr[2];
    // }

    //安卓手机返回按钮
    $ionicPlatform.registerBackButtonAction(function(e) {
        var current_state_name = $state.current.name;

        if (!$rootScope.IBSpj) {
            if (current_state_name == 'BSApp' || current_state_name == 'anticipateProfit') {
                navigator.app.exitApp();
            }
            return;
        }

        if (current_state_name == 'BSApp' || $scope.modal.isShown()) {

            $scope.optionsPopup = $ionicPopup.show({
                template: '<div class="tc titleText">是否退出应用？</div>',
                title: '<strong>提示</strong>',
                scope: $scope,
                buttons: [{
                    text: '取消'
                }, {
                    text: '<b>退出</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        return e;
                    }
                }, ]
            });

            $scope.optionsPopup.then(function(res) {
                if (res) {
                    navigator.app.exitApp();
                }
            });
            e.preventDefault();
            return false;
        } else {
            navigator.app.backHistory();
        }

    }, 201);


    if (!$localCache.get('tokenId')) {
        $rootScope.loginTag = false;
    } else {
        $rootScope.loginTag = true;
    }

    $scope.$watch('loginTag', function() {
        if ($rootScope.loginTag) {
            $scope.init(); //初始化
            
        }
    });

    $scope.logout = function() {
        if ($scope.toPopup) {
            $scope.toPopup.close();
        }
        $scope.logoutPopup = $ionicPopup.show({
            templateUrl: "templates/logout.html",
            title: '<strong>退出登录</strong>',
            scope: $scope,
            buttons: [{
                text: '取消'
            }, {
                text: '<b>退出</b>',
                type: 'button-energized',
                onTap: function(e) {
                    return e;
                }
            }, ]
        });
        $scope.logoutPopup.then(function(res) {
            if (res) {

                $net.post('/CRUD/CRUD-CQ-Auth-logout.do', {}).then(function(res) {
                    $localCache.remove('tokenId');
                    $localCache.remove('storeInfo');
                    ModalService.show('templates/modal/loginModel.html', 'LoginCtrl');
                    $rootScope.loginTag = false;
                    window.plugins.jPushPlugin.setTagsWithAlias([], '');
                });
            }
        });

    };

    $scope.keepPassWord = {
        oldPassword: '',
        newPassword: ''
    }
    $scope.changePW = function() {
        if ($scope.toPopup) {
            $scope.toPopup.close();
        }
        $scope.changePWPopup = $ionicPopup.show({
            templateUrl: "templates/popview/changePW.html",
            title: '<strong>修改密码</strong>',
            scope: $scope,
            buttons: [{
                text: '取消'
            }, {
                text: '<b>确认</b>',
                type: 'button-energized',
                onTap: function(e) {
                    return 1;
                }
            }, ]
        });

        $scope.changePWPopup.then(function(res) {
            if (res == 1) {
                var sUrl_ = '/CRUD/CRUD-U-Auth-changePassword.do';
                $net.post(sUrl_, {
                    oldPassword: $scope.keepPassWord.oldPassword,
                    newPassword: $scope.keepPassWord.newPassword
                }).then(function(res) {
                    if (res.success) {
                        $localCache.remove('tokenId');
                        $localCache.remove('storeInfo');
                        $scope.keepPassWord = '';
                        userFactory.showAlert($ionicPopup, $scope, '修改成功！', false, function() {
                            ModalService.show('templates/modal/loginModel.html', 'LoginCtrl', true);
                        });
                    } else {
                        userFactory.showAlert($ionicPopup, $scope, res.msg);
                    }
                })
            }
        });
    }

    $scope.toPersonalCenter = function() {
        $scope.toPopup = $ionicPopup.show({
            templateUrl: "templates/popview/personalCenter.html",
            cssClass: 'personal-popup',
            scope: $scope,
        });
        var htmlEl = angular.element(document.querySelector('html')); //点击罩层外关闭弹框
        htmlEl.on('click', function(event) {
            if (event.target.nodeName === 'HTML') {
                if ($scope.toPopup) {
                    $scope.toPopup.close();
                }
            }
        });
    }
    $scope.toAnticipateProfit = function() {
        $scope.toPopup.close();
        $state.go('anticipateProfit');
    }
    $scope.toAboutChief = function() {
        $scope.toPopup.close();
        $state.go('aboutChief');
    }

    $scope.changeMyMessage = function() {
        $scope.toPopup.close();
        $state.go('changePersonalMessage');
    }
    $scope.toDeliveryAddress = function() {
        $scope.toPopup.close();
        $state.go('deliveryAddress');
    }


    $scope.init = function() {
        $scope.data.cityCode = 14
        //获取用户基本信息
        $net.get('/CRUD/CRUD-Q-Auth-getUserInfo.do').then(function(res) {
            if (res.success) {
                if (res.result.headImg == null) {
                    $scope.headImg = 'img/leftbar_touxiang.png';
                } else {
                    $scope.headImg = $cfg.imgApi + res.result.headImg;
                }
                if (res.result.nickName == null) {
                    $scope.nickName = '无';
                } else {
                    $scope.nickName = res.result.nickName;
                }
                $scope.userName = res.result.userName;
                $scope.companyName = res.result.companyName;
                $scope.regionName = res.result.regionName;
                $scope.agentName = res.result.userName;
                $scope.userId = res.result.userId;
                $localCache.set('storeInfo', res.result);

                $scope.getLicense();
                $scope.getCityList();
                $scope.getExpireInsuranceList();
                $scope.queryUnreadMsg();
            } else {

            }
        })
    }

    //获取未读消息
    $scope.queryUnreadMsg = function() {
        $net.get('/CRUD/CRUD-Q-Msg-queryUnreadMsg.do').then(function(res) {
            if (res.success) {
                $scope.unreadMsg = res.result.unreadMsg > 0 ? true : false;
            }
        })
    }

    //获取车牌简称 
    $scope.getLicense = function() {
        $net.get('/CRUD/CRUD-Q-IBS-Public-getLicenseplateShort.do').then(function(res) {
            if (res.success) {
                $scope.license = res.result;
                for (var i in $scope.license) {
                    if ($scope.license[i].isDefault == 1) {
                        $scope.selectedLicense = $scope.selectedLicense || $scope.license[i].aliasName;
                    }
                }
            }
        })
    }

    $scope.chooseCarRegion = function() {
        $scope.optionsPopup = $ionicPopup.show({
            templateUrl: "templates/popview/carRegion.html",
            scope: $scope,
            animation: 'slide-in-top',
            title: '车牌号头选择'
        });
        var htmlEl = angular.element(document.querySelector('html')); //点击罩层外关闭弹框
        htmlEl.on('click', function(event) {
            if (event.target.nodeName === 'HTML') {
                if ($scope.optionsPopup) {
                    $scope.optionsPopup.close();
                }
            }
        });
    };

    $scope.selectRegion = function(item) {
        $scope.selectedLicense = item.aliasName;
        $scope.optionsPopup.close();
    };

    // 获取投保地区列表
    $scope.getCityList = function() {
        $net.get('/CRUD/CRUD-Q-IBS-Public-getCityList.do', {}, {
            isLoading: 1
        }).then(function(res) {
            if (res.success) {
                $scope.citys = res.result;
                for (var i in $scope.citys) {
                    if ($scope.citys[i].isDefault == 1) {
                        $scope.data.cityCode = $scope.citys[i].cityCode;
                    }
                }
            } else {

            }
        })
    };


    //获取到期车险列表
    $scope.getExpireInsuranceList = function() {
        $net.get('/CRUD/CRUD-Q-IBS-Insurance-getExpireInsuranceList.do', {
            rows: 10
        }).then(function(res) {
            if (res.success) {
                $scope.insuranceList = res.result.rows;
            } else {

            }
        })
    };

    //下拉刷新
    $scope.doRefresh = function() {
        $net.get('/CRUD/CRUD-Q-IBS-Insurance-getExpireInsuranceList.do').then(function(res) {
            if (res.success) {
                $scope.insuranceList = res.result.rows;
            } else {

            }
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.currentDate = $filter('date')(new Date(), 'yyyy-MM-dd');
    //样式
    var headHeight = (screen.width * 125) / 750;
    var barHeight = (screen.height * 180) / 1334;

    $scope.headBar = {
        "height": "" + barHeight + "px",
        "padding": "" + (barHeight - headHeight) / 2 + "px " + (screen.width * 65) / 750 + "px"
    };

    $scope.headImgH = {
        "height": "" + headHeight + "px",
        "width": "" + headHeight + "px",
        "border-radius": "" + headHeight / 2 + "px"
    };

    $scope.textH = {
        "color": "#fff",
        "line-height": "" + headHeight / 2 + "px"
    };
    //error border

    function errorBorder(idname) {
        document.getElementById(idname).style.border = "1px solid red";
    };

    function successBorder(idname) {
        document.getElementById(idname).style.border = "none";
    };

    function isVehicleNumber(vehicleNumber) {

        var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        return express.test(vehicleNumber);
    }


    $scope.textCheckbox = true;
    $scope.change1 = function(textCheckbox) {
        $scope.textCheckbox = textCheckbox;
    }

    // $scope.selectCity = function(cityCode) {
    //     $scope.cityCode = cityCode;
    // }


    $scope.nextOperation = function(licenseNo, cityCode, userId) {
        if ($scope.textCheckbox) {
            if ($scope.data.licenseNo) {
                $scope.licenseNos = $scope.selectedLicense + $scope.data.licenseNo.toUpperCase();
                if (!isVehicleNumber($scope.licenseNos)) {
                    userFactory.showAlert($ionicPopup, $scope, '亲，请填写正确的车牌号码！')
                    return false;
                }
                if (!$scope.data.cityCode || $scope.data.cityCode == null) {
                    userFactory.showAlert($ionicPopup, $scope, '亲，请选择投保地区！')
                    return false;
                }
                $state.go('selectInsurance', { licenseNo: $scope.licenseNos, cityCode: $scope.data.cityCode, agentName: $scope.agentName, userId: $scope.userId, router: 1 });
                // successBorder('licenseNoId');
                // 保存用户输入记录
                // var record = locals.getObject('CNRecord') instanceof Array ? locals.getObject('CNRecord') : new Array();
                // record.push($scope.data.licenseNo);
                // record = $filter('unique')(record);
                // locals.setObject('CNRecord', record);
                return false;
            } else {
                userFactory.showAlert($ionicPopup, $scope, '亲，您还没填写车牌号码！')

            }
        } else {
            userFactory.showAlert($ionicPopup, $scope, '亲，您还没勾选《免责条款》！')
        }
    }


    $scope.toQuotedPrice = function() {
        $state.go('quotedPrice', { cityCode: $scope.cityCode, agentName: $scope.agentName, userId: $scope.userId });

    };
    // $scope.toDetail = function(num) {
    //     $state.go('insuranceDetail', {
    //         titel: '续保详情',
    //         btnMessgage: '一键报价',
    //         licenseNo: num
    //     });
    // }
    $scope.userInfo = $localCache.get('storeInfo');
    $scope.goSelectSurrence = function(cityCode, licenseNo) {
        $state.go('selectInsurance', {
            licenseNo: licenseNo,
            cityCode: cityCode,
            agentName: $scope.userInfo.userName,
            userId: $scope.userInfo.userId,
            router: 1
        });
    };
    $scope.toInsureProgress = function() {
        $state.go('insureProgress');
    }
    $scope.toExceptionCause = function() {
        $state.go('exceptionCause');
    }

    $scope.backNavi = function() {
        $localCache.remove('storeInfo');
        if (device.platform != "Android") {
            cordova.BSTool.backNavi();
        } else {
            navigator.app.exitApp();
        }
    }
})

//个人中心
.controller('ChangePersonalMessageCtrl', function($scope, $state, LoadingView, LCamera, $net, $localCache, userFactory, $ionicPopup, $ionicActionSheet) {

    $scope.user = {
        userName: '',
        userMobile: ''
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.userInfo();
    });

    $scope.userInfo = function() {
        $net.get('/CRUD/CRUD-Q-Auth-getUserInfo.do').then(function(res) {
            if (res.success) {
                if (res.result.headImg == null) {
                    $scope.headImg = 'img/leftbar_touxiang.png';
                } else {
                    $scope.headImg = $cfg.imgApi + res.result.headImg;
                }
                if (res.result.nickName == null) {
                    $scope.nickName = '无';
                } else {
                    $scope.nickName = res.result.nickName;
                }
                $scope.userName = res.result.userName;
                $scope.userMobile = res.result.userMobile;
                $scope.user.userName = res.result.userName;
                $scope.user.userMobile = res.result.userMobile;
            } else {

            }
        })
    }


    $scope.changeUserName = function() {
        $scope.changeUserNamePopup = $ionicPopup.show({
            templateUrl: "templates/popview/changeUserName.html",
            title: '<strong>修改用户名称</strong>',
            scope: $scope,
            buttons: [{
                text: '取消'
            }, {
                text: '<b>确定</b>',
                type: 'button-energized',
                onTap: function(e) {
                    return e;
                }
            }, ]
        });
        $scope.changeUserNamePopup.then(function(res) {
            if (res) {
                $scope.userName = $scope.user.userName;
                $scope.upUserInfo(2);
            }
        });
    }

    $scope.changeUserMobile = function() {
        $scope.changeUserMobilePopup = $ionicPopup.show({
            templateUrl: "templates/popview/changeUserMobile.html",
            title: '<strong>修改手机号码</strong>',
            scope: $scope,
            buttons: [{
                text: '取消'
            }, {
                text: '<b>确定</b>',
                type: 'button-energized',
                onTap: function(e) {
                    return e;
                }
            }, ]
        });
        $scope.changeUserMobilePopup.then(function(res) {
            if (res) {
                $scope.userMobile = $scope.user.userMobile;
                $scope.upUserInfo(3);
            }
        });
    }

    $scope.upUserInfo = function(mes) {
        var data = {};
        if (mes == 1) {
            data.headImg = $scope.keepImg;
        } else if (mes == 2) {
            data.uName = $scope.userName;
        } else {
            data.userMobile = $scope.userMobile;
        }
        $net.upload('/CRUD/CRUD-U-Auth-upUserInfo.do', data, {
            isLoading: 1
        }).then(function(res) {
            if (res.success) {
                if ($scope.changeMyPicPopup) {
                    $scope.changeMyPicPopup.close();
                }
                userFactory.showAlert($ionicPopup, $scope, '修改成功！');
            } else {
                userFactory.showAlert($ionicPopup, $scope, res.msg);
            }
            if (mes == 1) {
                LoadingView.hide();
            }
        })
    }

    //添加相片，调用相机
    $scope.showCamera = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: '拍照'
            }, {
                text: '相册'
            }],
            titleText: '选择上传方式',
            cancelText: '取消',
            buttonClicked: function(index) {
                var sourceType = 0;
                index == 0 ? sourceType = 1 : sourceType = 0;
                LCamera.getPictureWithType(sourceType).then(function(imageInfo) {

                    $scope.headImg = imageInfo.imageSrc;
                    $scope.keepImg = imageInfo.imageBlob;
                    $scope.upUserInfo(1);

                }, function(error) {

                })
                return true;
            }
        });
    };


    //样式
    var headHeight = (screen.width * 125) / 750;
    var barHeight = (screen.height * 180) / 1334;
    $scope.headImgH = {
        "height": "" + headHeight + "px",
        "width": "" + headHeight + "px",
        "border-radius": "" + headHeight / 2 + "px"
    };

})

//登录
.controller('LoginCtrl', function($scope, $state, $net, $localCache, userFactory, $ionicPopup, $rootScope, LoadingView) {
    $scope.loginData = {};
    $scope.loginBtn = '登录';
    $scope.login = function(loginData) {
        var sUrl_ = '/CRUD/CRUD-CQ-IBS-Auth-login.do';
        $net.post(sUrl_, {
            lgiName: loginData.username,
            lgiPwd: loginData.password
        }, {
            isLoading: 1,
        }).then(function(res) {
            if (res.success) {
                $localCache.set('tokenId', res.result.tokenId);
                // $state.go('BSApp');
                $scope.closeModal();
                $rootScope.loginTag = true;
                $net.get('/CRUD/CRUD-Q-App-getPushInfo.do').then(function(res) {
                    if (res.success) {
                        window.plugins.jPushPlugin.setTagsWithAlias(res.result.tags, res.result.alias);
                    } else {

                    }
                })
            } else {
                LoadingView.timeShow(res.msg)
                    // userFactory.showAlert($ionicPopup, $scope, '账号或密码错误');
            }
        })
    }

    $scope.doLogin = function() {
        $scope.login($scope.loginData);
    };
})

//免责条款
.controller('exceptionCauseCtrl', function($scope, $state) {
    $scope.toAAA = function() {
        $state.go('fillInfo');
    }
})

//人保报价详情
.controller('plccOfferDetailsCtrl', function($scope, userFactory, $validate, $ionicHistory, LoadingView, $state, $stateParams, $ionicModal, $ionicPopup, $net) {

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.init();
    });

    $ionicHistory.goBack = function() {
        $ionicHistory.clearCache();
        $state.go('BSApp');
    }

    $scope.showDetailImg = 'img/chevron-down.png';
    $scope.showOfferDetails = function() {
        $scope.isShowImgState = !$scope.isShowImgState;
        $scope.showDetailImg = $scope.isShowImgState ? 'img/chevron-down.png' : 'img/chevron-up.png';
    };

    $scope.insureenumval = {
        sanZhe: {},
        boLi: {},
        chengKe: {},
        huaHen: {},
        siJi: {},
        hcXiulichang: {}
    };
    $scope.btnWord = '等待中';
    $scope.iserrorReport = false;
    $scope.init = function() {
        $net.post('/CRUD/CRUD-Q-IBS-Public-getInsureenumval.do').then(function(res) {
            if (res.success) {
                var data = res.result;
                for (var i in data.sanZhe) {
                    $scope.insureenumval.sanZhe[data.sanZhe[i].enumValue] = data.sanZhe[i].enumKey;
                };
                for (var i in data.boLi) {
                    $scope.insureenumval.boLi[data.boLi[i].enumValue] = data.boLi[i].enumKey;
                };
                for (var i in data.chengKe) {
                    $scope.insureenumval.chengKe[data.chengKe[i].enumValue] = data.chengKe[i].enumKey;
                };
                for (var i in data.huaHen) {
                    $scope.insureenumval.huaHen[data.huaHen[i].enumValue] = data.huaHen[i].enumKey;
                };
                for (var i in data.siJi) {
                    $scope.insureenumval.siJi[data.siJi[i].enumValue] = data.siJi[i].enumKey;
                };
                for (var i in data.xiulichangType) {
                    $scope.insureenumval.hcXiulichang[data.xiulichangType[i].enumValue] = data.xiulichangType[i].enumKey;
                }
            }
        }).then(function() {
            if ($stateParams.router == 4) {
                $scope.insuranceCompanyList = JSON.parse($stateParams.list.insuranceCompanyList);
                $scope.quotationList = $stateParams.list;
                $scope.licenseNo = $scope.quotationList.licenseNo;
                $scope.carVin = $scope.quotationList.carVin;
                $scope.insureAgentUname = $scope.quotationList.insureAgentUname;
                $scope.isShowFooter = true;
                for (var z in $scope.insuranceCompanyList) {
                    $scope.insuranceCompanyId = $scope.insuranceCompanyList[z].insuranceCompanyId;
                    $scope.AutoQuotation();
                };
            } else if ($stateParams.router == 5) {
                $scope.licenseNo = $stateParams.licenseNo;
                $scope.carVin = $stateParams.carVin;
                $scope.insureAgentUname = $stateParams.insureAgentUname;
                $scope.insuranceCompanyId = $stateParams.quoteGroup;
                $scope.isShowFooter = false;
                $scope.autoInsuranceRenewal();
            }

        })
    };

    // 自动报价 POST
    $scope.AutoQuotation = function() {
        LoadingView.loadShowLongTime('正在提交信息，请稍候......');
        $net.post('/CRUD/CRUD-U-IBS-Insurance-AutoQuotation.do', $scope.quotationList, { timeout: 1000 * 60 * 3 }).then(function(res) {
            if (res.success) {
                $scope.getQuoteInfo();
            } else {
                LoadingView.hide();
                userFactory.showAlert($ionicPopup, $scope, res.msg, $ionicHistory, callback);

                function callback() {
                    $ionicHistory.clearCache();
                    $state.go('BSApp');
                };

            }
        }, function(error) {
            if (error.status < 0) {
                LoadingView.hide();
                userFactory.showAlert($ionicPopup, $scope, '请求超时', $ionicHistory, function() {
                    $ionicHistory.clearCache();
                    $state.go('BSApp');
                });
            };
        })
    };

    //一键续保 
    $scope.autoInsuranceRenewal = function() {
        LoadingView.loadShowLongTime('正在获取续保信息，请稍候......');
        $net.post('/CRUD/CRUD-U-IBS-Insurance-autoInsuranceRenewal.auth ', {
            licenseNo: $scope.licenseNo
        }, { timeout: 1000 * 60 * 3 }).then(function(res) {
            if (res.success) {
                $scope.getQuoteInfo();
            } else {
                LoadingView.hide();
                userFactory.showAlert($ionicPopup, $scope, res.msg, $ionicHistory, callback);

                function callback() {
                    $ionicHistory.clearCache();
                    $state.go('BSApp');
                };
            }
        }, function(error) {
            if (error.status < 0) {
                LoadingView.hide();
                userFactory.showAlert($ionicPopup, $scope, '请求超时', $ionicHistory, function() {
                    $ionicHistory.clearCache();
                    $state.go('BSApp');
                });
            };
        })
    };

    //获取车辆报价信息
    $scope.getQuoteInfo = function() {
        LoadingView.loadShowLongTime('正在查询报价，请稍候......');
        $net.post('/CRUD/CRUD-U-IBS-Insurance-getQuoteInfo.do', {
            licenseNo: $scope.licenseNo,
            quoteGroup: $scope.insuranceCompanyId
        }, { timeout: 1000 * 60 * 3 }).then(function(res) {
            if (res.success) {
                if (res.result.QuoteStatus == 0 || res.result.QuoteStatus == -1) {

                    LoadingView.hide();
                    userFactory.showAlert($ionicPopup, $scope, res.result.QuoteResult, $ionicHistory, callback);

                    function callback() {
                        $ionicHistory.clearCache();
                        $state.go('BSApp');
                    };
                } else {
                    $scope.info = res.result;
                    $scope.info.sanZhe = $scope.insureenumval['sanZhe'][$scope.info.sanZhe];
                    $scope.info.boLi = $scope.insureenumval['boLi'][$scope.info.boLi];
                    $scope.info.chengKe = $scope.insureenumval['chengKe'][$scope.info.chengKe];
                    $scope.info.huaHen = $scope.insureenumval['huaHen'][$scope.info.huaHen];
                    $scope.info.siJi = $scope.insureenumval['siJi'][$scope.info.siJi];
                    $scope.info.hcXiulichang = $scope.insureenumval['hcXiulichang'][$scope.info.hcXiulichang];
                    $scope.info.daoQiang = $scope.info.daoQiang == 0 ? '不投保' : $scope.info.daoQiang;
                    $scope.info.ziRan = $scope.info.ziRan == 0 ? '不投保' : $scope.info.ziRan;
                    $scope.info.sheShui = $scope.info.sheShui == 0 ? '不投保' : $scope.info.sheShui;
                    $scope.info.cheSun = $scope.info.cheSun == 0 ? '不投保' : $scope.info.cheSun;
                    $scope.info.hcSanfangteyue = $scope.info.hcSanfangteyue == 0 ? '不投保' : '投保';
                    $scope.orderId = $scope.info.orderId;
                    if ($stateParams.router == 4) {
                        $scope.getQuoteSubmitInfo();
                    }
                }

            } else {
                LoadingView.hide();
                userFactory.showAlert($ionicPopup, $scope, res.msg, $ionicHistory, callback);

                function callback() {
                    $ionicHistory.clearCache();
                    $state.go('BSApp');
                };
            }
        }, function(error) {
            if (error.status < 0) {
                LoadingView.hide();
                userFactory.showAlert($ionicPopup, $scope, '请求超时', $ionicHistory, function() {
                    $ionicHistory.clearCache();
                    $state.go('BSApp');
                });
            };
        })

    };

    //获取车辆核保信息 
    $scope.getQuoteSubmitInfo = function() {
        LoadingView.loadShowLongTime('正在获取核保信息，请稍候......');
        $net.post('/CRUD/CRUD-U-IBS-Insurance-getQuoteSubmitInfo.do', {
            licenseNo: $scope.licenseNo,
            quoteGroup: $scope.insuranceCompanyId
        }, { timeout: 1000 * 60 * 3 }).then(function(res) {
            if (res.success) {
                LoadingView.hide();
                if (res.result.SubmitStatus == 1) {
                    $scope.iserrorReport = false;
                    $scope.id = 2;
                    $scope.hebaoModel = '已核保';
                    $scope.btnWord = '预约出单';
                } else if (res.result.SubmitStatus == 2) {
                    $scope.iserrorReport = false;
                    userFactory.showAlert($ionicPopup, $scope, '未到期未核保', $ionicHistory, callback);

                    function callback() {
                        $ionicHistory.clearCache();
                        $state.go('BSApp');
                    };

                } else {
                    $scope.iserrorReport = true;
                    $scope.errorReport = res.result.SubmitResult;
                    $scope.id = 1;
                    $scope.hebaoModel = '未核保';
                    $scope.btnWord = '申请核保';

                }

            } else {
                LoadingView.hide();
                userFactory.showAlert($ionicPopup, $scope, res.msg, $ionicHistory, callback);

                function callback() {
                    $ionicHistory.clearCache();
                    $state.go('BSApp');
                };
            }
        }, function(error) {
            if (error.status < 0) {
                LoadingView.hide();
                userFactory.showAlert($ionicPopup, $scope, '请求超时', $ionicHistory, function() {
                    $ionicHistory.clearCache();
                    $state.go('BSApp');
                });
            };
        })
    };

    $scope.toUploadData = function(id) {
        id = $scope.id;
        if (id == 1) {
            // $net.post('/CRUD/CRUD-U-IBS-Order-apptUnderwriting.do', {
            //     orderId: $scope.orderId,
            // }).then(function(res) {
            //     if (res.success) {
            //         userFactory.showAlert($ionicPopup, $scope, '资料提交成功，等待人工核保', $ionicHistory, callback);

            //         function callback() {
            //             $ionicHistory.clearCache();
            //             $state.go('BSApp');
            //         };
            //     } else {
            //         userFactory.showAlert($ionicPopup, $scope, res.msg);
            //     }
            // });

            $state.go('supplementaryInfo', { orderId: $scope.orderId });
            // $state.go('uploadData', { orderId: $scope.orderId });
        } else {
            $state.go('fillInfo', { orderId: $scope.orderId });
        }
    };

    $scope.toQuotedPrice = function() {
        $state.go('quotedPrice');
    }
    $scope.data = {};
    $scope.sendSMS = function() {

        if ($scope.sendModal) {
            $scope.sendModal.show();
        } else {
            $ionicModal.fromTemplateUrl('templates/modal/sendModal.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.sendModal = modal;
                $scope.sendModal.show();
                $net.post('/CRUD/CRUD-Q-IBS-Order-qryMessage.do', {
                    orderId: $scope.orderId
                }).then(function(res) {
                    if (res.success) {
                        $scope.data.postMsg = res.result;
                        // if ($scope.info.holderMobile || $scope.info.insuredMobile) {
                        //     $scope.data.phoneNum = $scope.info.holderMobile || $scope.info.insuredMobile;
                        // }
                    } else {

                    }
                })
            });
        }
    }
    $scope.backBSapp = function() {
        // $scope.postMsg = '';

        $scope.sendModal.hide();
    };
    $scope.certainSend = function() {
        if (!$scope.data.postMsg) {
            userFactory.showAlert($ionicPopup, $scope, '请输入短信内容！');
            return false;
        } else {
            if (!$scope.data.phoneNum) {
                userFactory.showAlert($ionicPopup, $scope, '请输入手机号码！');
                return false;
            } else if (!$validate.isPhoneNumber($scope.data.phoneNum)) {
                userFactory.showAlert($ionicPopup, $scope, '手机号码格式不正确！');
                return false;
            } else {
                $net.post('/CRUD/CRUD-Q-IBS-Order-postMessage.do', {
                    postMsg: $scope.data.postMsg,
                    phoneNum: $scope.data.phoneNum
                }).then(function(res) {
                    if (res.success) {
                        $scope.sendModal.hide();
                        $scope.popupContent = "发送成功"
                        $scope.optionsPopup = $ionicPopup.show({
                            templateUrl: "templates/popview/showAlert.html",
                            scope: $scope
                        });

                    } else {
                        userFactory.showAlert($ionicPopup, $scope, res.msg);
                    }
                })
            }
        }


    };
    $scope.backOther = function() {
        $scope.optionsPopup.close();
        $scope.sendModal.hide();

    }
    $scope.backHome = function() {
        $scope.optionsPopup.close();
        $scope.sendModal.hide();
    }

})

//进度详情
.controller('BackDetailsfoCtrl', function($scope, $state, $validate, $net, $ionicHistory, $stateParams, $ionicModal, userFactory, $ionicPopup, LoadingView) {

    $scope.$on('$ionicView.beforeEnter', function() {

    })

    $scope.epolicyList = [];
    $scope.isContentShow = false;
    $scope.detailsTitle = $stateParams.title;
    $scope.isShowOrHide = $stateParams.btnFlag;
    $scope.orderId = $stateParams.orderId;
    $scope.showDetailBT = '查看更多信息';
    $scope.showDetail = function() {
        $scope.isShowDetail = !$scope.isShowDetail;
        $scope.showDetailBT = $scope.isShowDetail ? '收起更多信息' : '查看更多信息';
    };
    $scope.showBusinessStartDate = function() {
        $scope.isBusinessStartDate = !$scope.isBusinessStartDate;
    };

    $scope.renewCertain = function() {
        $state.go('selectInsurance');
    };
    $scope.insureenumval = {
        sanZhe: {},
        boLi: {},
        chengKe: {},
        huaHen: {},
        siJi: {},
        hcXiulichang: {}
    };

    //预约出单
    $scope.toFillInfo = function(orderId) {
        if (orderId != null) {
            $state.go('fillInfo', { orderId: orderId });
        } else {
            userFactory.showAlert($ionicPopup, $scope, '缺少参数');
        }
    }

    //立即支付
    $scope.toPayOrder = function(orderId) {
        if (orderId != null) {
            $state.go('insurancePolicyPay', { orderId: orderId });
        } else {
            userFactory.showAlert($ionicPopup, $scope, '缺少参数');
        }
    }

    // 申请核保
    $scope.goFillinfo = function(orderId) {

        // $net.post('/CRUD/CRUD-U-IBS-Order-apptUnderwriting.do', {
        //     orderId: orderId,
        // }).then(function(res) {
        //     if (res.success) {
        //         userFactory.showAlert($ionicPopup, $scope, '资料提交成功，等待人工核保', $ionicHistory, callback);

        //         function callback() {
        //             $ionicHistory.clearCache();
        //             $state.go('BSApp');
        //         };
        //     } else {
        //         userFactory.showAlert($ionicPopup, $scope, res.msg);
        //     }
        // });

        $state.go('supplementaryInfo', { orderId: orderId });
        // $state.go('uploadData', { orderId: orderId });
    };
    //确定收单
    $scope.confirmOrder = function(oid) {
        var optionsPopup = $ionicPopup.show({
            title: '收单提示',
            templateUrl: 'templates/popview/confirmOrder.html',
            buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
                text: '取消',
                type: 'button-default',
                onTap: function(e) {
                    // 当点击时，e.preventDefault() 会阻止弹窗关闭。
                    return false;
                }
            }, {
                text: '确定',
                okType: 'button-positive',
                onTap: function(e) {
                    // 返回的值会导致处理给定的值。
                    return true;
                }
            }]
        });
        optionsPopup.then(function(res) {
            if (res) {
                $net.post('/CRUD/CRUD-U-IBS-Order-issuingOrder.do', {
                    orderId: oid,
                }).then(function(res) {
                    if (res.success) {
                        userFactory.showAlert($ionicPopup, $scope, '收单成功', $ionicHistory);
                    } else {
                        userFactory.showAlert($ionicPopup, $scope, '收单失败');
                    }
                })

            }
        });
        var htmlEl = angular.element(document.querySelector('html')); //点击罩层外关闭弹框
        htmlEl.on('click', function(event) {
            if (event.target.nodeName === 'HTML') {
                if (optionsPopup) {
                    optionsPopup.close();
                }
            }
        });

    };

    $scope.init = function() {
        LoadingView.loadShowLongTime('数据加载中，请稍等片刻......');
        $net.post('/CRUD/CRUD-Q-IBS-Public-getInsureenumval.do').then(function(res) {
            if (res.success) {
                var data = res.result;
                for (var i in data.sanZhe) {
                    $scope.insureenumval.sanZhe[data.sanZhe[i].enumValue] = data.sanZhe[i].enumKey;
                };
                for (var i in data.boLi) {
                    $scope.insureenumval.boLi[data.boLi[i].enumValue] = data.boLi[i].enumKey;
                };
                for (var i in data.chengKe) {
                    $scope.insureenumval.chengKe[data.chengKe[i].enumValue] = data.chengKe[i].enumKey;
                };
                for (var i in data.huaHen) {
                    $scope.insureenumval.huaHen[data.huaHen[i].enumValue] = data.huaHen[i].enumKey;
                };
                for (var i in data.siJi) {
                    $scope.insureenumval.siJi[data.siJi[i].enumValue] = data.siJi[i].enumKey;
                };
                for (var i in data.xiulichangType) {
                    $scope.insureenumval.hcXiulichang[data.xiulichangType[i].enumValue] = data.xiulichangType[i].enumKey;
                }
            }
        }).then(function() {
            $net.post('/CRUD/CRUD-Q-IBS-Order-qryOrderInfo.do', {
                orderId: $scope.orderId
            }).then(function(res) {
                if (res.success) {
                    LoadingView.hide();
                    $scope.isContentShow = true;
                    $scope.qryOrderInfo = res.result;
                    $scope.qryOrderInfo.sanZhe = $scope.insureenumval['sanZhe'][$scope.qryOrderInfo.sanZhe];
                    $scope.qryOrderInfo.boLi = $scope.insureenumval['boLi'][$scope.qryOrderInfo.boLi];
                    $scope.qryOrderInfo.chengKe = $scope.insureenumval['chengKe'][$scope.qryOrderInfo.chengKe];
                    $scope.qryOrderInfo.huaHen = $scope.insureenumval['huaHen'][$scope.qryOrderInfo.huaHen];
                    $scope.qryOrderInfo.siJi = $scope.insureenumval['siJi'][$scope.qryOrderInfo.siJi];
                    $scope.qryOrderInfo.hcXiulichang = $scope.insureenumval['hcXiulichang'][$scope.qryOrderInfo.hcXiulichang];
                    $scope.qryOrderInfo.daoQiang = $scope.qryOrderInfo.daoQiang == 0 ? '不投保' : $scope.qryOrderInfo.daoQiang;
                    $scope.qryOrderInfo.ziRan = $scope.qryOrderInfo.ziRan == 0 ? '不投保' : $scope.qryOrderInfo.ziRan;
                    $scope.qryOrderInfo.sheShui = $scope.qryOrderInfo.sheShui == 0 ? '不投保' : $scope.qryOrderInfo.sheShui;
                    $scope.qryOrderInfo.cheSun = $scope.qryOrderInfo.cheSun == 0 ? '不投保' : $scope.qryOrderInfo.cheSun;
                    $scope.qryOrderInfo.hcSanfangteyue = $scope.qryOrderInfo.hcSanfangteyue == 0 ? '不投保' : '投保';

                    if ($scope.qryOrderInfo.epolicy != null) {
                        $scope.epolicyList.push({
                            imageSrc: $cfg.imgApi + $scope.qryOrderInfo.epolicy
                        });
                    }
                    if ($scope.qryOrderInfo.epolicy2 != null) {
                        $scope.epolicyList.push({
                            imageSrc: $cfg.imgApi + $scope.qryOrderInfo.epolicy2
                        });
                    }
                    if ($scope.qryOrderInfo.epolicy3 != null) {
                        $scope.epolicyList.push({
                            imageSrc: $cfg.imgApi + $scope.qryOrderInfo.epolicy3
                        });
                    }
                } else {
                    LoadingView.hide();
                    $scope.isContentShow = false;
                    userFactory.showAlert($ionicPopup, $scope, res.msg);
                }
            });
        })
    }

    $scope.init();

    $scope.data = {};
    $scope.sendSMS = function() {

        if ($scope.sendModal) {
            $scope.sendModal.show();
        } else {
            $ionicModal.fromTemplateUrl('templates/modal/sendModal.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.sendModal = modal;
                $scope.sendModal.show();
                $net.post('/CRUD/CRUD-Q-IBS-Order-qryMessage.do', {
                    orderId: $scope.orderId
                }).then(function(res) {
                    if (res.success) {
                        $scope.data.postMsg = res.result;
                        // if ($scope.info.holderMobile || $scope.info.insuredMobile) {
                        //     $scope.data.phoneNum = $scope.info.holderMobile || $scope.info.insuredMobile;
                        // }
                    } else {

                    }
                })
            });
        }


    }
    $scope.backBSapp = function() {
        // $scope.data.postMsg = '';
        $scope.sendModal.hide();
    };
    $scope.certainSend = function() {
        if (!$scope.data.postMsg) {
            userFactory.showAlert($ionicPopup, $scope, '请输入短信内容！');
            return false;
        } else {
            if (!$scope.data.phoneNum) {
                userFactory.showAlert($ionicPopup, $scope, '请输入手机号码！');
                return false;
            } else if (!$validate.isPhoneNumber($scope.data.phoneNum)) {
                userFactory.showAlert($ionicPopup, $scope, '手机号码格式不正确！');
                return false;
            } else {
                $net.post('/CRUD/CRUD-Q-IBS-Order-postMessage.do', {
                    postMsg: $scope.data.postMsg,
                    phoneNum: $scope.data.phoneNum
                }).then(function(res) {
                    if (res.success) {
                        $scope.sendModal.hide();
                        $scope.popupContent = "发送成功"
                        $scope.optionsPopup = $ionicPopup.show({
                            templateUrl: "templates/popview/showAlert.html",
                            scope: $scope
                        });

                    } else {
                        userFactory.showAlert($ionicPopup, $scope, res.msg);
                    }
                })
            }
        }
    };
    $scope.backOther = function() {
        $scope.optionsPopup.close();
        $scope.sendModal.hide();
    };

    $scope.IMGH = {
        "height": "" + ((screen.width - 50) / 3) * 0.75 + "px",
        "width": "" + (screen.width - 50) / 3 + "px"
    }

    $scope.photoView = function(showTypeId) {
        var item = [];
        if (showTypeId == 0) {
            if ($scope.qryOrderInfo.drivingLicense != null) {
                item.push({
                    src: $cfg.imgApi + $scope.qryOrderInfo.drivingLicense,
                    w: 600,
                    h: 400
                });
            }
        } else if (showTypeId == 1) {
            if ($scope.qryOrderInfo.insuredIdCardPhoto != null) {
                item.push({
                    src: $cfg.imgApi + $scope.qryOrderInfo.insuredIdCardPhoto,
                    w: 600,
                    h: 400
                });
            }
        } else if (showTypeId == 2) {
            if ($scope.qryOrderInfo.carInvoicePhoto != null) {
                item.push({
                    src: $cfg.imgApi + $scope.qryOrderInfo.carInvoicePhoto,
                    w: 600,
                    h: 400
                });
            }
        } else if (showTypeId == 3) {
            if ($scope.qryOrderInfo.carvinPhoto != null) {
                item.push({
                    src: $cfg.imgApi + $scope.qryOrderInfo.carvinPhoto,
                    w: 600,
                    h: 400
                });
            }
        } else if (showTypeId == 4) {
            if ($scope.qryOrderInfo.carbodyPhoto1 != null) {
                item.push({
                    src: $cfg.imgApi + $scope.qryOrderInfo.carbodyPhoto1,
                    w: 600,
                    h: 400
                });
            }
            if ($scope.qryOrderInfo.carbodyPhoto2 != null) {
                item.push({
                    src: $cfg.imgApi + $scope.qryOrderInfo.carbodyPhoto2,
                    w: 600,
                    h: 400
                });
            }
            if ($scope.qryOrderInfo.carbodyPhoto3 != null) {
                item.push({
                    src: $cfg.imgApi + $scope.qryOrderInfo.carbodyPhoto3,
                    w: 600,
                    h: 400
                });
            }
            if ($scope.qryOrderInfo.carbodyPhoto4 != null) {
                item.push({
                    src: $cfg.imgApi + $scope.qryOrderInfo.carbodyPhoto4,
                    w: 600,
                    h: 400
                });
            }
        } else if (showTypeId == 5) {
            if ($scope.qryOrderInfo.otherPhoto != null) {
                item.push({
                    src: $cfg.imgApi + $scope.qryOrderInfo.otherPhoto,
                    w: 600,
                    h: 400
                });
            }
            if ($scope.qryOrderInfo.otherPhoto2 != null) {
                item.push({
                    src: $cfg.imgApi + $scope.qryOrderInfo.otherPhoto2,
                    w: 600,
                    h: 400
                });
            }
            if ($scope.qryOrderInfo.otherPhoto3 != null) {
                item.push({
                    src: $cfg.imgApi + $scope.qryOrderInfo.otherPhoto3,
                    w: 600,
                    h: 400
                });
            }
        } else {
            if ($scope.qryOrderInfo.epolicy != null) {
                item.push({
                    src: $cfg.imgApi + $scope.qryOrderInfo.epolicy,
                    w: 600,
                    h: 400
                });
            }
            if ($scope.qryOrderInfo.epolicy2 != null) {
                item.push({
                    src: $cfg.imgApi + $scope.qryOrderInfo.epolicy2,
                    w: 600,
                    h: 400
                });
            }
            if ($scope.qryOrderInfo.epolicy3 != null) {
                item.push({
                    src: $cfg.imgApi + $scope.qryOrderInfo.epolicy3,
                    w: 600,
                    h: 400
                });
            }
        }
        var pswpElement = document.querySelectorAll('.pswp')[0];
        var options = {
            history: false,
            focus: false,
            index: 0,
            showAnimationDuration: 0,
            hideAnimationDuration: 0,
        };

        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, item, options);
        gallery.init();

        gallery.invalidateCurrItems();
        gallery.updateSize(true);
    }
})

//选择保险公司
.controller('selectCompanyCtrl', function($scope, $ionicHistory, userFactory, $ionicPopup, $state, $net, $localCache, $rootScope, LoadingView, $stateParams) {

    $scope.paramsList = $stateParams.list;

    //获取保险公司列表
    $scope.getInsuranceCompanies = function() {
        LoadingView.loadShowLongTime('正在获取保险公司，请稍候......');

        $net.get('/CRUD/CRUD-Q-IBS-Public-getInsuranceCompanies.do', {
            cityCode: $scope.paramsList.cityCode
        }).then(function(res) {
            if (res.success && res.result) {
                LoadingView.hide();
                var companyList = res.result;
                $scope.companyList = companyList;
            } else {}
        })
    }

    $scope.getInsuranceCompanies();

    $scope.result = {};
    var insuranceCompanyList = [];
    $scope.companySelect = 1;
    insuranceCompanyList.push({ insuranceCompanyId: 4, companyCatgory: 1 });

    $scope.isCompany = function(companyId, companyCatgory) {
        $scope.companySelect = companyCatgory;
        insuranceCompanyList = [];
        insuranceCompanyList.push({ insuranceCompanyId: companyId, companyCatgory: companyCatgory });
    }

    // $scope.isCompany = function(companyId,companyCatgory,e) {
    //     if (e.target.checked) { //选中，就添加
    //         insuranceCompanyList.push({ insuranceCompanyId: companyId,companyCatgory:companyCatgory });
    //     } else { //去除就删除result里
    //         insuranceCompanyList.shift();
    //     }
    // }


    $scope.toPlccOfferDetails = function() {

        var quoteGroup = 0;
        for (var z in insuranceCompanyList) {
            quoteGroup += insuranceCompanyList[z].insuranceCompanyId;
        };
        if (insuranceCompanyList.length == 0) {
            userFactory.showAlert($ionicPopup, $scope, '亲，您还没选择保险公司！');
            return false;
        } else {
            if ($stateParams.router == 1 || $stateParams.router == 3) { //自动或重新报价

                $scope.listParams = $stateParams;
                $scope.paramsLists = {
                    cityCode: $scope.paramsList.cityCode,
                    insureAgentUid: $scope.paramsList.insureAgentUid,
                    insureAgentUname: $scope.paramsList.insureAgentUname,
                    licenseNo: $scope.paramsList.licenseNo,
                    carownerName: $scope.paramsList.carownerName,
                    carownerCard: $scope.paramsList.carownerCard,
                    carVin: $scope.paramsList.carVin,
                    engineNo: $scope.paramsList.engineNo,
                    modleName: $scope.paramsList.modleName,
                    registerDate: $scope.paramsList.registerDate,
                    holderPartytype: $scope.paramsList.holderPartytype,
                    holderName: $scope.paramsList.holderName,
                    holderIdCard: $scope.paramsList.holderIdCard,
                    holderMobile: $scope.paramsList.holderMobile,
                    holderIdCardType: $scope.paramsList.holderIdCardType,
                    insuredName: $scope.paramsList.insuredName,
                    insuredIdCard: $scope.paramsList.insuredIdCard,
                    insuredMobile: $scope.paramsList.insuredMobile,
                    insuredIdCardType: $scope.paramsList.insuredIdCardType,
                    forceStartDate: $scope.paramsList.forceStartDate,
                    businessStartDate: $scope.paramsList.businessStartDate,
                    seatCount: $scope.paramsList.seatCount,
                    force: $scope.paramsList.force,
                    cheSun: $scope.paramsList.cheSun,
                    bujimianChesun: $scope.paramsList.bujimianChesun,
                    sanZhe: $scope.paramsList.sanZhe,
                    bujimianSanzhe: $scope.paramsList.bujimianSanzhe,
                    daoQiang: $scope.paramsList.daoQiang,
                    bujimianDaoqiang: $scope.paramsList.bujimianDaoqiang,
                    siJi: $scope.paramsList.siJi,
                    bujimianSiji: $scope.paramsList.bujimianSiji,
                    chengKe: $scope.paramsList.chengKe,
                    bujimianChengke: $scope.paramsList.bujimianChengke,
                    boLi: $scope.paramsList.boLi,
                    huaHen: $scope.paramsList.huaHen,
                    bujimianHuahen: $scope.paramsList.bujimianHuahen,
                    sheShui: $scope.paramsList.sheShui,
                    bujimianSheshui: $scope.paramsList.bujimianSheshui,
                    ziRan: $scope.paramsList.ziRan,
                    bujimianZiran: $scope.paramsList.bujimianZiran,
                    hcSanfangteyue: $scope.paramsList.hcSanfangteyue,
                    hcXiulichangType: $scope.paramsList.hcXiulichangType,
                    hcXiulichang: $scope.paramsList.hcXiulichang,
                    insuranceCompanyList: JSON.stringify(insuranceCompanyList),
                    quoteGroup: quoteGroup,
                    memo: $scope.paramsList.memo,
                    autoMoldcode: $scope.paramsList.autoMoldcode,
                    purchasePrice: $scope.paramsList.purchasePrice,
                    exhaustScale: $scope.paramsList.exhaustScale
                };
                $scope.listParams.list = $scope.paramsLists;
                $scope.listParams.router = 4;
                $state.go('plccOfferDetails', $scope.listParams);

            } else { //人工报价

                if (!$scope.paramsList.insuredName) {
                    $scope.paramsList.insuredName = '';
                }
                if (!$scope.paramsList.insuredMobile) {
                    $scope.paramsList.insuredMobile = '';
                }
                if (!$scope.paramsList.insuredIdCard) {
                    $scope.paramsList.insuredIdCard = '';
                }
                if (!$scope.paramsList.insuredIdCardType) {
                    $scope.paramsList.insuredIdCardType = '';
                }
                $scope.paramsLists = {
                    cityCode: $scope.paramsList.cityCode,
                    insureAgentUid: $scope.paramsList.insureAgentUid,
                    insureAgentUname: $scope.paramsList.insureAgentUname,
                    licenseNo: $scope.paramsList.licenseNo,
                    holderName: $scope.paramsList.holderName,
                    holderIdCard: $scope.paramsList.holderIdCard,
                    holderMobile: $scope.paramsList.holderMobile,
                    holderIdCardType: $scope.paramsList.holderIdCardType,
                    insuredName: $scope.paramsList.insuredName,
                    insuredIdCard: $scope.paramsList.insuredIdCard,
                    insuredMobile: $scope.paramsList.insuredMobile,
                    insuredIdCardType: $scope.paramsList.insuredIdCardType,
                    forceStartDate: $scope.paramsList.forceStartDate,
                    businessStartDate: $scope.paramsList.businessStartDate,
                    seatCount: $scope.paramsList.seatCount,
                    force: $scope.paramsList.force,
                    cheSun: $scope.paramsList.cheSun,
                    bujimianChesun: $scope.paramsList.bujimianChesun,
                    sanZhe: $scope.paramsList.sanZhe,
                    bujimianSanzhe: $scope.paramsList.bujimianSanzhe,
                    daoQiang: $scope.paramsList.daoQiang,
                    bujimianDaoqiang: $scope.paramsList.bujimianDaoqiang,
                    siJi: $scope.paramsList.siJi,
                    bujimianSiji: $scope.paramsList.bujimianSiji,
                    chengKe: $scope.paramsList.chengKe,
                    bujimianChengke: $scope.paramsList.bujimianChengke,
                    boLi: $scope.paramsList.boLi,
                    huaHen: $scope.paramsList.huaHen,
                    bujimianHuahen: $scope.paramsList.bujimianHuahen,
                    sheShui: $scope.paramsList.sheShui,
                    bujimianSheshui: $scope.paramsList.bujimianSheshui,
                    ziRan: $scope.paramsList.ziRan,
                    bujimianZiran: $scope.paramsList.bujimianZiran,
                    hcSanfangteyue: $scope.paramsList.hcSanfangteyue,
                    hcXiulichangType: $scope.paramsList.hcXiulichangType,
                    hcXiulichang: $scope.paramsList.hcXiulichang,
                    insuranceCompanyList: JSON.stringify(insuranceCompanyList),
                    quoteGroup: quoteGroup,
                    memo: $scope.paramsList.memo,
                    carownerMobile: $stateParams.carownerMobile,
                    quoteTypeId: $stateParams.quoteTypeId,
                    insuredIdCardPhotoImg: $stateParams.insuredIdCardPhotoImg,
                    insuredIdCardPhotoImg_name: $stateParams.insuredIdCardPhotoImg_name,
                    drivingLicenseImg: $stateParams.drivingLicenseImg,
                    drivingLicenseImg_name: $stateParams.drivingLicenseImg_name,
                    carInvoicePhotoImg: $stateParams.carInvoicePhotoImg,
                    carInvoicePhotoImg_name: $stateParams.carInvoicePhotoImg_name,
                    carbodyPhotoImg1: $stateParams.carbodyPhotoImg1,
                    carbodyPhotoImg1_name: $stateParams.carbodyPhotoImg1_name,
                    carbodyPhotoImg2: $stateParams.carbodyPhotoImg2,
                    carbodyPhotoImg2_name: $stateParams.carbodyPhotoImg2_name,
                    carbodyPhotoImg3: $stateParams.carbodyPhotoImg3,
                    carbodyPhotoImg3_name: $stateParams.carbodyPhotoImg3_name,
                    carbodyPhotoImg4: $stateParams.carbodyPhotoImg4,
                    carbodyPhotoImg4_name: $stateParams.carbodyPhotoImg4_name,
                    carvinPhotoImg: $stateParams.carvinPhotoImg,
                    carvinPhotoImg_name: $stateParams.carvinPhotoImg_name,
                    otherPhotoImg1: $stateParams.otherPhotoImg1,
                    otherPhotoImg1_name: $stateParams.otherPhotoImg1_name,
                    otherPhotoImg2: $stateParams.otherPhotoImg2,
                    otherPhotoImg2_name: $stateParams.otherPhotoImg2_name,
                    otherPhotoImg3: $stateParams.otherPhotoImg3,
                    otherPhotoImg3_name: $stateParams.otherPhotoImg3_name,
                    underwritingPhotoImg1: $stateParams.underwritingPhotoImg1,
                    underwritingPhotoImg1_name: $stateParams.underwritingPhotoImg1_name,
                    underwritingPhotoImg2: $stateParams.underwritingPhotoImg2,
                    underwritingPhotoImg2_name: $stateParams.underwritingPhotoImg2_name,
                    underwritingPhotoImg3: $stateParams.underwritingPhotoImg3,
                    underwritingPhotoImg3_name: $stateParams.underwritingPhotoImg3_name,
                    businessLicenseImg: $stateParams.businessLicenseImg,
                    businessLicenseImg_name: $stateParams.businessLicenseImg_name,
                    agentPhotoImg1: $stateParams.agentPhotoImg1,
                    agentPhotoImg1_name: $stateParams.agentPhotoImg1_name,
                    agentPhotoImg2: $stateParams.agentPhotoImg2,
                    agentPhotoImg2_name: $stateParams.agentPhotoImg2_name,
                    agentSignPhotoImg: $stateParams.agentSignPhotoImg,
                    agentSignPhotoImg_name: $stateParams.agentSignPhotoImg_name
                };
                if ($stateParams.router == 2) {
                    $scope.artificialQuotation(); //人工报价
                } else if ($stateParams.router == 6) { //修改保单
                    $scope.paramsLists.orderId = $scope.paramsList.orderId;
                    $scope.modifyInscuranceOrder();
                }
            }
        }
    };

    $scope.artificialQuotation = function() { //人工报价

        $net.upload('/CRUD/CRUD-U-IBS-Insurance-artificialQuotation.do', $scope.paramsLists, {
            isLoading: 1
        }).then(function(res) {
            if (res.success) {
                userFactory.showAlert($ionicPopup, $scope, '资料提交成功，等待人工核保', $ionicHistory, callback);

                function callback() {
                    $ionicHistory.clearCache();
                    $state.go('insureProgress', { num: 1 });
                };
            } else {
                userFactory.showAlert($ionicPopup, $scope, res.msg);
            }
        });
    };

    $scope.modifyInscuranceOrder = function() { //修改保单

        $net.upload('/CRUD/CRUD-U-IBS-Order-modifyInscuranceOrder.do', $scope.paramsLists, {
            isLoading: 1
        }).then(function(res) {
            if (res.success) {

                userFactory.showAlert($ionicPopup, $scope, '修改成功！', $ionicHistory, callback);

                function callback() {
                    $ionicHistory.clearCache();
                    $state.go('insureProgress', { num: 1 });
                };

            } else {
                userFactory.showAlert($ionicPopup, $scope, res.msg);
            }
        });
    };
})

//申请核保
.controller('uploadDataCtrl', function($scope, userFactory, $state, $ionicPopup, $net, $stateParams, LoadingView, LCamera, $ionicActionSheet) {

    $scope.isDisabled = true;
    $scope.getInsuranceCompanies = function() {

        // $net.post('/CRUD/CRUD-Q-IBS-Public-getInsuranceCompanies.do ').then(function(res) {
        //     if (res.success) {
        //         $scope.companyList = res.result;
        //     } else {

        //     }
        // })
    };
    //添加相片，调用相机
    $scope.identityCarId = {
        front: {
            imageSrc: "img/add.png",
            imageBlob: ''
        }
    };
    $scope.vehicleOrCar = {
        front: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },

    };
    $scope.showCamera = function(image, images) {
        $ionicActionSheet.show({
            buttons: [{
                text: '拍照'
            }, {
                text: '相册'
            }],
            titleText: '选择上传方式',
            cancelText: '取消',
            buttonClicked: function(index) {
                var sourceType = 0;
                index == 0 ? sourceType = 1 : sourceType = 0;
                LCamera.getPictureWithType(sourceType).then(function(imageInfo) {
                    for (var i in images) {
                        if (images[i] == image) {
                            images[i].imageSrc = imageInfo.imageSrc;
                            images[i].imageBlob = imageInfo.imageBlob;
                        }
                    }
                }, function(error) {
                    console.log(error);
                })
                return true;
            }
        });
    };

    //申请核保 
    $scope.uploadOperation = function() {
        $net.upload('/CRUD/CRUD-U-IBS-Order-apptUnderwriting.do', {
            orderId: $stateParams.orderId,
            insuredIdCardPhotoImg: $scope.identityCarId.front.imageBlob,
            insuredIdCardPhotoImg_name: '1.png',
            drivingLicenseImg: $scope.vehicleOrCar.front.imageBlob,
            drivingLicenseImg_name: '2.png',
        }, {
            isLoading: 1
        }).then(function(res) {
            if (res.success) {
                userFactory.showAlert($ionicPopup, $scope, '资料提交成功，等待人工核保', $ionicHistory, callback);

                function callback() {
                    $ionicHistory.clearCache();
                    $state.go('insureProgress', { num: 1 });
                };
            } else {
                userFactory.showAlert($ionicPopup, $scope, res.msg);
            }
        })
    }

    $scope.backHome = function() {
        $scope.optionsPopup.close();
        $state.go('BSApp');
    }

    $scope.IMGH = {
        "height": "" + ((screen.width - 50) / 3) * 0.75 + "px",
        "width": "" + (screen.width - 50) / 3 + "px"
    }
})

//预约出单
.controller('fillInfoCtrl', function($scope, $rootScope, $state, $ionicPopup, $validate, $stateParams, $net, $localCache, $ionicHistory, userFactory, LoadingView, LCamera, $ionicActionSheet) {

    var storeInfo = $localCache.get('storeInfo');
    $scope.orderId = $stateParams.orderId;

    $scope.$on('$ionicView.beforeEnter', function() {
        if ($rootScope.dataMsg) {
            $scope.data.consignee = $rootScope.dataMsg.contacts;
            $scope.data.consigneeMobile = $rootScope.dataMsg.mobileNumber;
            $scope.data.consigneeAddress = $rootScope.dataMsg.fullAddress;
        }
    })

    $scope.$on('$ionicView.leave', function() {
        if ($rootScope.dataMsg) {
            $rootScope.dataMsg = null;
        }
    })

    $net.post('/CRUD/CRUD-Q-IBS-Order-qryOrderInfo.do', {
        orderId: $scope.orderId
    }).then(function(res) {
        if (res.success) {
            $scope.insuredName = res.result.insuredName;
            $scope.carownerCard = res.result.carownerCard;
            $scope.insuredMobile = res.result.insuredMobile;
            $scope.fullPremium = res.result.totalAmount;
            $scope.netPremium = res.result.orderAmount;
            $scope.data.consignee = res.result.consignee;
            $scope.data.invPayee = res.result.invPayee;
            $scope.data.consigneeMobile = res.result.consigneeMobile;
            $scope.data.consigneeAddress = res.result.consigneeAddress;
            $scope.isRadio = 1;
        } else {}
    });


    //判斷發票類型選中的aradio
    $scope.FapiaocheckRadio = function(str) {
        if (str == 2) {
            $scope.isRadio = 2;
        } else {
            $scope.isRadio = 1;
        }
    };
    $scope.payFee = 1;
    // 判斷支付費用類型的aradio
    $scope.payCheckRadio = function(type) {
        $scope.payFee = type;
    }

    $scope.data = {};
    $scope.data.consigneeType = 1;
    // 邮寄地址为空
    $scope.reNull = function() {
        $scope.data.consigneeAddress = '';
    }

    $scope.payOrder = function() {

        if ($scope.data.consignee == null || $scope.data.consignee.trim() == '') {
            userFactory.showAlert($ionicPopup, $scope, "请填写收件人姓名!");
            return;
        }
        if ($scope.data.consigneeMobile == null || $scope.data.consigneeMobile.trim() == '') {
            userFactory.showAlert($ionicPopup, $scope, "请填写手机号码!");
            return;
        }
        if (!$validate.isPhoneNumber($scope.data.consigneeMobile)) {
            userFactory.showAlert($ionicPopup, $scope, "手机号码格式不对!");
            return;
        }
        if ($scope.data.consigneeType == 1 || $scope.data.consigneeType == 4) {
            if ($scope.data.consigneeAddress == null || $scope.data.consigneeAddress.trim() == '') {
                userFactory.showAlert($ionicPopup, $scope, "请填写收件地址!");
                return;
            }
        }
        var data = {
            orderId: $scope.orderId,
            payFee: $scope.payFee,
            invType: $scope.isRadio,
            invPayee: $scope.data.invPayee,
            consignee: $scope.data.consignee,
            consigneeMobile: $scope.data.consigneeMobile,
            consigneeAddress: $scope.data.consigneeAddress,
            insuredIdCardPhotoImg: $scope.InputIDPhoto.front.imageBlob,
            insuredIdCardPhotoImg_name: '1.png',
            consigneeType: $scope.data.consigneeType
        };
        $net.post('/CRUD/CRUD-U-IBS-Order-payOrder.do', data).then(function(res) {
            if (res.success) {
                //成功之後跳轉頁面
                // $state.go('insurancePolicyPay', { orderId: $scope.orderId });
                userFactory.showAlert($ionicPopup, $scope, '提交成功，等待客服处理', $ionicHistory, function callback() {
                    $ionicHistory.clearCache();
                    $state.go('insureProgress', { num: 2 });
                });
            } else {
                userFactory.showAlert($ionicPopup, $scope, res.msg);
            }
        })

        // $scope.optionsPopup = $ionicPopup.show({
        //     templateUrl: "templates/popview/selectPayStyle.html",
        //     scope: $scope
        // });
        // return false;
    }

    $scope.confirmPayOrder = function() {
        $scope.optionsPopup.close();

    }

    $scope.selectShop = function() {
        $scope.promptContent = '您是否将门店(' + storeInfo.companyName + ')设置为保单收件地址？';
        $scope.selectShopPV = $ionicPopup.show({
            templateUrl: "templates/popview/promptPopView.html",
            scope: $scope
        });
    }

    $scope.sendChooce = function() {
        $state.go('deliveryAddress', { 'index': 1 })
    }

    $scope.cancel = function() {
        $scope.selectShopPV.close();
    }

    $scope.certain = function() {
        $scope.selectShopPV.close();
        $scope.data.consigneeAddress = storeInfo.companyAddress;

    }


    $scope.showDetailBT = '- 打开证件上传 -';
    $scope.showDetail = function() {
        $scope.isShowDetail = !$scope.isShowDetail;
        $scope.showDetailBT = $scope.isShowDetail ? '- 收起证件上传 -' : '- 打开证件上传 -';
    }


    //填写资料--》证件上传
    $scope.InputIDPhoto = {
        front: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },

    };
    $scope.IMGH = {
        "height": "" + ((screen.width - 50) / 3) * 0.75 + "px",
        "width": "" + (screen.width - 50) / 3 + "px"
    }

    $scope.showCamera = function(image, images) {
        $ionicActionSheet.show({
            buttons: [{
                text: '拍照'
            }, {
                text: '相册'
            }],
            titleText: '选择上传方式',
            cancelText: '取消',
            buttonClicked: function(index) {
                var sourceType = 0;
                index == 0 ? sourceType = 1 : sourceType = 0;
                LCamera.getPictureWithType(sourceType).then(function(imageInfo) {
                    for (var i in images) {
                        if (images[i] == image) {
                            images[i].imageSrc = imageInfo.imageSrc;
                            images[i].imageBlob = imageInfo.imageBlob;
                        }
                    }
                }, function(error) {
                    console.log(error);
                })
                return true;
            }
        });
    };
})

//保单支付
.controller('insurancePolicyPayCtrl', function($scope, $state, $ionicPopup, $stateParams, $net, LoadingView, $ionicHistory, $timeout, $rootScope) {

    $scope.wxPayUrl = {
        isSelect: false
    };
    $scope.wxPayCode = {
        isSelect: true
    };
    $scope.wx = {
        isSelect: false
    };

    $scope.orderId = $stateParams.orderId;

    $net.get('/CRUD/CRUD-Q-IBS-Order-qryPayOrderInfo.do', {
        orderId: $scope.orderId
    }).then(function(res) {
        if (res.success) {
            $scope.qryPayCode = res.result;
        } else {}
    }).then(function() {
        $net.get('/CRUD/CRUD-CQ-IBS-Order-qryPayCode.do', {
            orderId: $scope.orderId
        }).then(function(res) {
            if (res.success) {
                // $scope.qryPayCode.payUrl = res.result.codeUrl;
                // $scope.qryPayCode.codeUrl = $cfg.api + '/qr.do?text=' + res.result.codeUrl;
                $scope.qryPayCode.codeUrl = $cfg.imgApi + res.result.codeUrl;
            } else {}
        })
    })



    $scope.payStyle = function(style) {
        $scope.wxPayUrl.isSelect = false;
        $scope.wxPayCode.isSelect = false;
        $scope.wx.isSelect = false;
        style.isSelect = true;
    }

    $scope.payCertain = function() {
        if ($scope.wxPayCode.isSelect) {
            $scope.optionsPopup = $ionicPopup.show({
                templateUrl: "templates/popview/wxCode.html",
                scope: $scope
            });
            var htmlEl = angular.element(document.querySelector('html')); //点击罩层外关闭弹框
            htmlEl.on('click', function(event) {
                if (event.target.nodeName === 'HTML') {
                    if ($scope.optionsPopup) {
                        $scope.optionsPopup.close();
                    }
                }
            });
        } else if ($scope.wxPayUrl.isSelect) {
            Wechat.share({
                text: $scope.qryPayCode.message + "\n\n点击链接完成支付：" + $scope.qryPayCode.payUrl,
                url: $scope.qryPayCode.payUrl,
                scene: Wechat.Scene.SESSION
            }, function() {

            }, function(reason) {
                alert("Failed: " + reason);
            });
        } else if ($scope.wx.isSelect) {
            LoadingView.loadShow();
            $net.post('/CRUD/CRUD-CU-IBS-tenpayRechargeAppPay.do', { orderId: $scope.orderId }).then(function(res) {
                if (res.success) {
                    var payReq = res.result;
                    var params = {
                        partnerid: payReq.partnerid, // merchant id
                        prepayid: payReq.prepayid, // prepay id
                        noncestr: payReq.noncestr, // nonce
                        timestamp: payReq.timestamp, // timestamp
                        package: payReq.package,
                        sign: payReq.sign // signed string
                    };
                    Wechat.sendPaymentRequest(params, function() {
                        LoadingView.timeShow("支付成功");
                        $rootScope.$emit("disPayOfInsurancePolicy");
                        $timeout(function() {
                            $ionicHistory.goBack(-3);
                        }, 2000)
                    }, function(reason) {
                        LoadingView.timeShow("失败: " + reason);
                    });
                }
            })
        }
    }
})

//人工报价
.controller('quotedPriceCtrl', function($scope, $state, $stateParams, userFactory, $ionicPopup, $rootScope, $net, LoadingView, LCamera, $ionicActionSheet, $ionicHistory) {
    $scope.tabNames = ['人工报价', '新车报价'];
    $scope.slectIndex = 0;
    $scope.data = {
        quoteType: 1
    }
    $scope.isSubmit = false;

    $scope.titelName = $scope.tabNames[$scope.slectIndex];
    $scope.postData = {
        carownerMobile: '',
    }
    $scope.companyN = "请选择";
    $scope.showDetailBT = '添加更多资料';
    $scope.showDetail = function() {
        $scope.isShowDetail = !$scope.isShowDetail;
        $scope.showDetailBT = $scope.isShowDetail ? '收起' : '添加更多资料';
    };

    //拍照示例
    $scope.toPhotographSample = function() {
        $state.go('photographSample');
    }

    $net.post('/CRUD/CRUD-Q-IBS-Public-getInsuranceCompanies.do', {
        cityCode: $stateParams.cityCode
    }).then(function(res) {
        if (res.success) {
            $scope.insuranceCompanyList = res.result;
            for (var i in $scope.insuranceCompanyList) {
                $scope.insuranceCompanyList[i].isSelect = false;
                if (i == 0) {
                    $scope.insuranceCompanyList[i].isSelect = true;
                }
            }
        } else {

        }
    });
    $scope.companyList = [{
        name: '中国人保车险',
        isSelect: true
    }, {
        name: '中华联合车险',
        isSelect: false
    }];

    var barTitels = ['机动车行驶证', '购车发票'];
    var QimgList = ['driver', 'invoice'];
    $scope.barTitel = barTitels[$scope.slectIndex];
    $scope.Qimg = QimgList[$scope.slectIndex];
    $scope.activeSlide = function(index) {
        $scope.slectIndex = index;
        $scope.titelName = $scope.tabNames[index];
        $scope.barTitel = barTitels[index];
        $scope.Qimg = QimgList[index];
    }

    $scope.selectCompany = function() {
        $scope.optionsPopup = $ionicPopup.show({
            templateUrl: "templates/popview/selectCompany.html",
            scope: $scope
        });
    }

    $scope.disSelect = function(company) {
        if (company.isSelect) {
            for (var i = 0; i < $scope.insuranceCompanyList.length; i++) {
                $scope.insuranceCompanyList[i].isSelect = false;
            };
            company.isSelect = true;
        } else {
            company.isSelect = true;
        };
    }


    $scope.selectCertain = function() {
        $scope.optionsPopup.close();
        for (var i = 0; i < $scope.insuranceCompanyList.length; i++) {
            var company = $scope.insuranceCompanyList[i];
            if (company.isSelect) {
                $scope.companyN = company.companyName;
                $scope.insuranceCompanyId = company.companyId;
                return;
            };
        };
    }

    //投保人身份证正面照
    $scope.identityCarId = {
        front: {
            imageSrc: "img/add.png",
            imageBlob: ''
        }

    };
    $scope.vehicleOrCar = {
        front: {
            imageSrc: "img/add.png",
            imageBlob: ''
        }
    };
    //验车照
    $scope.verificationCarPhotos = {
        img1: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img2: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img3: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img4: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img5: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },

    };


    //其他证件
    $scope.otherDocumentsPhotos = {
        img1: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img2: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img3: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
    };

    //核保所需照片
    $scope.underwritingPhotos = {
        img1: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img2: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img3: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
    };

    //企业营业执照
    $scope.businessLicense = {
        front: {
            imageSrc: "img/add.png",
            imageBlob: ''
        }
    };

    //代办人身份证正反照
    $scope.agentPhotos = {
        img1: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img2: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
    };

    //代办人签署投保单照片
    $scope.agentSignPhoto = {
        front: {
            imageSrc: "img/add.png",
            imageBlob: ''
        }
    };

    $scope.showCamera = function(image, images) {
        $ionicActionSheet.show({
            buttons: [{
                text: '拍照'
            }, {
                text: '相册'
            }],
            titleText: '选择上传方式',
            cancelText: '取消',
            buttonClicked: function(index) {
                LoadingView.show();
                var sourceType = 0;
                index == 0 ? sourceType = 1 : sourceType = 0;
                LCamera.getPictureWithType(sourceType).then(function(imageInfo) {
                    for (var i in images) {
                        if (images[i] == image) {
                            images[i].imageSrc = imageInfo.imageSrc;
                            images[i].imageBlob = imageInfo.imageBlob;
                        }
                    }
                    $scope.isSubmit = false;
                    LoadingView.hide();
                }, function(error) {
                    LoadingView.timeShow('取消');
                })
                return true;
            }
        });

        // LoadingView.loadShow();
        // LCamera.getPictureWithType(1).then(function(imageInfo) {
        //     for (var i in images) {
        //         if (images[i] == image) {
        //             images[i].imageSrc = imageInfo.imageSrc;
        //             images[i].imageBlob = imageInfo.imageBlob;
        //         }
        //     }
        //     LoadingView.hide();
        // }, function(error) {
        //     LoadingView.timeShow('取消拍照');
        // })
    };

    $scope.IMGH = {
        "height": "" + ((screen.width - 50) / 3) * 0.75 + "px",
        "width": "" + (screen.width - 50) / 3 + "px"
    }

    $scope.nextOperation = function() {
        if ($scope.data.quoteType == 1) {
            if (!$scope.identityCarId.front.imageBlob || !$scope.vehicleOrCar.front.imageBlob) {
                userFactory.showAlert($ionicPopup, $scope, '请上传投保人证件照或机动车行驶证！');
                return false;
            }
        } else if ($scope.data.quoteType == 2) {
            if (!$scope.businessLicense.front.imageBlob) {
                userFactory.showAlert($ionicPopup, $scope, '请上传企业营业执照！');
                return false;
            }
        }
        if ($scope.slectIndex == 0) {
            $scope.carOrArtificial = {
                carownerMobile: $scope.postData.carownerMobile,
                quoteTypeId: $scope.slectIndex + 1,
                insuredIdCardPhotoImg: $scope.identityCarId.front.imageBlob,
                insuredIdCardPhotoImg_name: '1.png',
                carbodyPhotoImg1: $scope.verificationCarPhotos.img1.imageBlob,
                carbodyPhotoImg1_name: '11.png',
                carbodyPhotoImg2: $scope.verificationCarPhotos.img2.imageBlob,
                carbodyPhotoImg2_name: '12.png',
                carbodyPhotoImg3: $scope.verificationCarPhotos.img3.imageBlob,
                carbodyPhotoImg3_name: '13.png',
                carbodyPhotoImg4: $scope.verificationCarPhotos.img4.imageBlob,
                carbodyPhotoImg4_name: '14.png',
                carvinPhotoImg: $scope.verificationCarPhotos.img5.imageBlob,
                carvinPhotoImg_name: '15.png',
                otherPhotoImg1: $scope.otherDocumentsPhotos.img1.imageBlob,
                otherPhotoImg1_name: '16.png',
                otherPhotoImg2: $scope.otherDocumentsPhotos.img2.imageBlob,
                otherPhotoImg2_name: '17.png',
                otherPhotoImg3: $scope.otherDocumentsPhotos.img3.imageBlob,
                otherPhotoImg3_name: '18.png',
                underwritingPhotoImg1: $scope.underwritingPhotos.img1.imageBlob,
                underwritingPhotoImg1_name: '19.png',
                underwritingPhotoImg2: $scope.underwritingPhotos.img2.imageBlob,
                underwritingPhotoImg2_name: '20.png',
                underwritingPhotoImg3: $scope.underwritingPhotos.img3.imageBlob,
                underwritingPhotoImg3_name: '21.png',
                businessLicenseImg: $scope.businessLicense.front.imageBlob,
                businessLicenseImg_name: '22.png',
                agentPhotoImg1: $scope.agentPhotos.img1.imageBlob,
                agentPhotoImg1_name: '23.png',
                agentPhotoImg2: $scope.agentPhotos.img2.imageBlob,
                agentPhotoImg2_name: '24.png',
                agentSignPhotoImg: $scope.agentSignPhoto.front.imageBlob,
                agentSignPhotoImg_name: '25.png',
                cityCode: $stateParams.cityCode,
                agentName: $stateParams.agentName,
                userId: $stateParams.userId,
                router: 2
            };
            $scope.carOrArtificial.drivingLicenseImg = $scope.vehicleOrCar.front.imageBlob;
            $scope.carOrArtificial.drivingLicenseImg_name = '2.png';
            $state.go('selectInsurance', $scope.carOrArtificial);

        } else {
            $scope.carOrArtificial = {
                carownerMobile: $scope.postData.carownerMobile,
                quoteTypeId: $scope.slectIndex + 1,
                insuredIdCardPhotoImg: $scope.identityCarId.front.imageBlob,
                insuredIdCardPhotoImg_name: '1.png',
                carbodyPhotoImg1: $scope.verificationCarPhotos.img1.imageBlob,
                carbodyPhotoImg1_name: '11.png',
                carbodyPhotoImg2: $scope.verificationCarPhotos.img2.imageBlob,
                carbodyPhotoImg2_name: '12.png',
                carbodyPhotoImg3: $scope.verificationCarPhotos.img3.imageBlob,
                carbodyPhotoImg3_name: '13.png',
                carbodyPhotoImg4: $scope.verificationCarPhotos.img4.imageBlob,
                carbodyPhotoImg4_name: '14.png',
                carvinPhotoImg: $scope.verificationCarPhotos.img5.imageBlob,
                carvinPhotoImg_name: '15.png',
                otherPhotoImg1: $scope.otherDocumentsPhotos.img1.imageBlob,
                otherPhotoImg1_name: '16.png',
                otherPhotoImg2: $scope.otherDocumentsPhotos.img2.imageBlob,
                otherPhotoImg2_name: '17.png',
                otherPhotoImg3: $scope.otherDocumentsPhotos.img3.imageBlob,
                otherPhotoImg3_name: '18.png',
                underwritingPhotoImg1: $scope.underwritingPhotos.img1.imageBlob,
                underwritingPhotoImg1_name: '19.png',
                underwritingPhotoImg2: $scope.underwritingPhotos.img2.imageBlob,
                underwritingPhotoImg2_name: '20.png',
                underwritingPhotoImg3: $scope.underwritingPhotos.img3.imageBlob,
                underwritingPhotoImg3_name: '21.png',
                businessLicenseImg: $scope.businessLicense.front.imageBlob,
                businessLicenseImg_name: '22.png',
                agentPhotoImg1: $scope.agentPhotos.img1.imageBlob,
                agentPhotoImg1_name: '23.png',
                agentPhotoImg2: $scope.agentPhotos.img2.imageBlob,
                agentPhotoImg2_name: '24.png',
                agentSignPhotoImg: $scope.agentSignPhoto.front.imageBlob,
                agentSignPhotoImg_name: '25.png',
                cityCode: $stateParams.cityCode,
                agentName: $stateParams.agentName,
                userId: $stateParams.userId,
                router: 2
            };
            $scope.carOrArtificial.carInvoicePhotoImg = $scope.vehicleOrCar.front.imageBlob;
            $scope.carOrArtificial.carInvoicePhotoImg_name = '3.png';
            $state.go('selectInsurance', $scope.carOrArtificial);
        }
    }
})

.controller('pleasantPromptCtrl', function($scope, $state) {})

//微信分享
.controller('wxPromptCtrl', function($scope, $ionicModal, $ionicPopup, $ionicHistory) {
    $scope.sendSMS = function() {
        // $ionicBackdrop.retain();
        $ionicModal.fromTemplateUrl('templates/modal/sendModal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    $scope.certainSend = function() {
        $scope.popupContent = "您已成功发送报价短信模板"
        $scope.optionsPopup = $ionicPopup.show({
            templateUrl: "templates/popview/successPopView.html",
            scope: $scope
        });
    }

    $scope.backHome = function() {
        $scope.optionsPopup.close();
        $scope.modal.hide();
    }
})

//补充资料
.controller('supplementaryInfoCtrl', function($state, $scope, $ionicModal, $ionicPopup, $stateParams, $ionicHistory, LoadingView, LCamera, $net, userFactory, $ionicActionSheet) {

    $scope.data = {
        quoteType: 1
    }
    $scope.isSubmit = true;

    //拍照示例
    $scope.toPhotographSample = function() {
        $state.go('photographSample');
    }

    $scope.showDetailBT = '添加更多资料';
    $scope.showDetail = function() {
        $scope.isShowDetail = !$scope.isShowDetail;
        $scope.showDetailBT = $scope.isShowDetail ? '收起' : '添加更多资料';
    }

    $scope.IMGH = {
        "height": "" + ((screen.width - 50) / 3) * 0.75 + "px",
        "width": "" + (screen.width - 50) / 3 + "px"
    }

    //身份证
    $scope.insuredIdCardPhoto = {
        front: {
            imageSrc: "img/add.png",
            imageBlob: ''
        }
    };
    //机动车行驶证
    $scope.drivingLicensesPhoto = {
        front: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },

    };
    //验车照
    $scope.verificationCarPhotos = {
        img1: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img2: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img3: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img4: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img5: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },

    };

    //其他证件
    $scope.otherDocumentsPhotos = {
        img1: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img2: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img3: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },

    };
    //核保所需照片
    $scope.underwritingPhotos = {
        img1: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img2: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img3: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
    };

    //企业营业执照
    $scope.businessLicense = {
        front: {
            imageSrc: "img/add.png",
            imageBlob: ''
        }
    };

    //代办人身份证正反照
    $scope.agentPhotos = {
        img1: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
        img2: {
            imageSrc: "img/add.png",
            imageBlob: ''
        },
    };

    //代办人签署投保单照片
    $scope.agentSignPhoto = {
        front: {
            imageSrc: "img/add.png",
            imageBlob: ''
        }
    };

    $scope.showCamera = function(image, images) {
        $ionicActionSheet.show({
            buttons: [{
                text: '拍照'
            }, {
                text: '相册'
            }],
            titleText: '选择上传方式',
            cancelText: '取消',
            buttonClicked: function(index) {
                var sourceType = 0;
                index == 0 ? sourceType = 1 : sourceType = 0;
                LCamera.getPictureWithType(sourceType).then(function(imageInfo) {
                    for (var i in images) {
                        if (images[i] == image) {
                            images[i].imageSrc = imageInfo.imageSrc;
                            images[i].imageBlob = imageInfo.imageBlob;
                        }
                    }
                    $scope.isSubmit = false;
                }, function(error) {
                    console.log(error);
                })
                return true;
            }
        });
    };


    $scope.completeMessage = function() {
        LoadingView.showLoading('图片上传中,请稍等片刻......');
        $net.upload('/CRUD/CRUD-U-IBS-Order-supplementaryInformation.do', {
            orderId: $stateParams.orderId,
            quoteType: $scope.data.quoteType,
            insuredIdCardPhotoImg: $scope.insuredIdCardPhoto.front.imageBlob,
            insuredIdCardPhotoImg_name: '1.png',
            drivingLicenseImg: $scope.drivingLicensesPhoto.front.imageBlob,
            drivingLicenseImg_name: '2.png',

            carbodyPhotoImg1: $scope.verificationCarPhotos.img1.imageBlob,
            carbodyPhotoImg1_name: '3.png',
            carbodyPhotoImg2: $scope.verificationCarPhotos.img2.imageBlob,
            carbodyPhotoImg2_name: '4.png',
            carbodyPhotoImg3: $scope.verificationCarPhotos.img3.imageBlob,
            carbodyPhotoImg3_name: '5.png',
            carbodyPhotoImg4: $scope.verificationCarPhotos.img4.imageBlob,
            carbodyPhotoImg4_name: '6.png',
            carvinPhotoImg: $scope.verificationCarPhotos.img5.imageBlob,
            carvinPhotoImg_name: '7.png',

            otherPhotoImg1: $scope.otherDocumentsPhotos.img1.imageBlob,
            otherPhotoImg1_name: '8.png',
            otherPhotoImg2: $scope.otherDocumentsPhotos.img2.imageBlob,
            otherPhotoImg2_name: '9.png',
            otherPhotoImg3: $scope.otherDocumentsPhotos.img3.imageBlob,
            otherPhotoImg3_name: '10.png',

            underwritingPhotoImg1: $scope.underwritingPhotos.img1.imageBlob,
            underwritingPhotoImg1_name: '19.png',
            underwritingPhotoImg2: $scope.underwritingPhotos.img2.imageBlob,
            underwritingPhotoImg2_name: '20.png',
            underwritingPhotoImg3: $scope.underwritingPhotos.img3.imageBlob,
            underwritingPhotoImg3_name: '21.png',
            businessLicenseImg: $scope.businessLicense.front.imageBlob,
            businessLicenseImg_name: '22.png',
            agentPhotoImg1: $scope.agentPhotos.img1.imageBlob,
            agentPhotoImg1_name: '23.png',
            agentPhotoImg2: $scope.agentPhotos.img2.imageBlob,
            agentPhotoImg2_name: '24.png',
            agentSignPhotoImg: $scope.agentSignPhoto.front.imageBlob,
            agentSignPhotoImg_name: '25.png',

        }, {
            isLoading: 1
        }).then(function(res) {
            LoadingView.hide();
            if (res.success) {
                // 一个提示对话框

                userFactory.showAlert($ionicPopup, $scope, '提交成功！', $ionicHistory, callback);

                function callback() {
                    $ionicHistory.clearCache();
                    $state.go('insureProgress', { num: 1 });
                };

            } else {
                userFactory.showAlert($ionicPopup, $scope, res.msg);
            }
        })
    }
})

/** 补充资料更多示例**/
.controller('photographSampleCtrl', function($scope) {
    $scope.IMGH = {
        "height": "" + ((screen.width - 40) / 2) * 0.75 + "px",
        "width": "" + (screen.width - 40) / 2 + "px"
    }
})

//详情查看图片
.controller('PicturesCtrl', function($scope, $stateParams) {

    showTypeId = $stateParams.typeId;
})

.controller('newsCentreCtrl', function($scope, $net, $state, userFactory, $ionicPopup) {

    $scope.$on('$ionicView.beforeEnter', function() {
        $net.get('/CRUD/CRUD-Q-Msg-getMsgList.do').then(function(res) {
            if (res.success) {
                $scope.newsList = res.result;
                if ($scope.newsList.length == 0) {
                    $scope.mesShow = false;
                } else {
                    $scope.mesShow = true;
                }
            }
        });
    })


    $scope.goInsureProgress = function(newsIF) {
        $net.post('/CRUD/CRUD-U-Msg-updateMsgStatus.do', { messageId: newsIF.messageId }).then(function(res) {
            if (res.success) {
                $state.go('insureProgress', {
                    num: newsIF.urlParams
                })
            } else {
                userFactory.showAlert($ionicPopup, $scope, res.msg);
            }
        });
    }
})

.controller('selectModelCtrl', function($scope, $stateParams, $ionicHistory, $rootScope, $ionicLoading, $net, LoadingView) {
    $scope.data = {};
    $scope.data.autoMoldcode = $stateParams.autoMoldcode;
    LoadingView.loadShowLongTime('数据加载中，请稍等......');

    $scope.$on('$ionicView.beforeEnter', function() {
        $net.post('/CRUD/CRUD-Q-IBS-Insurance-getVehicleList.do', {
            modleName: $stateParams.modleName,
            licenseNo: $stateParams.licenseNo,
        }, { timeout: 1000 * 60 * 3 }).then(function(res) {
            LoadingView.hide();
            if (res.success) {
                $scope.modelList = res.result;
            }
        });
    })

    $scope.selectModel = function() {
        if ($scope.data.autoMoldcode) {
            for (var i in $scope.modelList) {
                if ($scope.data.autoMoldcode == $scope.modelList[i].VehicleNo) {
                    $scope.vehicleInfo = $scope.modelList[i];
                }
            }
            $rootScope.vehicleInfo = $scope.vehicleInfo;
        }
        $ionicHistory.goBack();
    }
})

.controller('deliveryAddressCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicHistory, $rootScope, $ionicLoading, $net, LoadingView, userFactory) {
    $scope.regionItem = {
        'itemShowCount': 5
    }

    $scope.$on('$ionicView.afterEnter', function() {
        $scope.qryUserAddress();
    })

    $scope.$on('$ionicView.beforeEnter', function() {
        if ($stateParams.index == 1) {
            $scope.isShowOrHideBtn = true;
        } else {
            $scope.isShowOrHideBtn = false;
        }
    })

    $scope.qryUserAddress = function() {
        $net.post('/CRUD/CRUD-Q-IBS-Public-qryUserAddress.do', {}, {
            isLoading: 1
        }).then(function(res) {
            if (res.success) {
                $scope.userAddress = res.result;
            } else {
                userFactory.showAlert($ionicPopup, $scope, res.msg);
            }
        })
    }

    //下拉刷新
    $scope.doRefresh = function() {
        $net.post('/CRUD/CRUD-Q-IBS-Public-qryUserAddress.do', {}, {
            isLoading: 1
        }).then(function(res) {
            if (res.success) {
                $scope.userAddress = res.result;
            } else {
                userFactory.showAlert($ionicPopup, $scope, res.msg);
            }
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    // 删除地址
    $scope.showConfirm = function(addrId) {
        var optionsPopup = $ionicPopup.show({
            title: '提示',
            templateUrl: 'templates/popview/delAddress.html',
            buttons: [{
                text: '取消',
                type: 'button-default',
                onTap: function(e) {
                    return false;
                }
            }, {
                text: '确定',
                okType: 'button-positive',
                onTap: function(e) {
                    return true;
                }
            }]
        });
        optionsPopup.then(function(res) {
            if (res) {
                if (res) {
                    $net.post('/CRUD/CRUD-U-IBS-Public-delUserAddress.do', {
                        addressId: addrId,
                    }).then(function(res) {
                        if (res.success) {
                            userFactory.showAlert($ionicPopup, $scope, '删除成功', false, $scope.qryUserAddress());
                        } else {
                            userFactory.showAlert($ionicPopup, $scope, '删除失败');
                        }
                    })
                }
            }
        });
        var htmlEl = angular.element(document.querySelector('html')); //点击罩层外关闭弹框
        htmlEl.on('click', function(event) {
            if (event.target.nodeName === 'HTML') {
                if (optionsPopup) {
                    optionsPopup.close();
                }
            }
        });
    };

    //设置默认地址
    $scope.serDefaultAddress = function(item) {
        if (item.isDefault == 0) {
            item.isDefault = 1;
        } else {
            item.isDefault = 0;
        }
        $net.post('/CRUD/CRUD-Q-IBS-Public-setDefaultAddress.do', {
            addressId: item.addressId,
            isDefault: item.isDefault
        }, {
            isLoading: 1
        }).then(function(res) {
            if (res.success) {
                $scope.qryUserAddress();
            } else {
                userFactory.showAlert($ionicPopup, $scope, res.msg);
            }
        })
    }

    //点击内容跳转
    $scope.toClickMsg = function(item) {
        if ($stateParams.index == 1) {
            $rootScope.dataMsg = item;
            $ionicHistory.goBack();
        } else {
            $state.go('addOrEditDeliveryAddress', { 'data': item })
        }
    };

    //新增或者编辑
    $scope.toAddOrEditDeliveryAddress = function(item) {
        $state.go('addOrEditDeliveryAddress', { 'data': item });
    };

})

.controller('addOrEditDeliveryAddressCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicHistory, $rootScope, $ionicLoading, $net, LoadingView, userFactory) {

    if ($stateParams.data) {
        $scope.whichName = '编辑地址';
    } else {
        $scope.whichName = '新增地址';
    }
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = {};
        if ($stateParams.data) {
            angular.extend($scope.data, $stateParams.data);
        } else {
            $scope.data = {
                isDefault: 0,
                addressHeader: ''
            };
        }
    })

    $scope.regionItem = {
        'itemShowCount': 5
    }

    //设置默认地址
    $scope.serDefaultAddress = function() {
        if ($scope.data.isDefault == 0) {
            $scope.data.isDefault = 1;
        } else {
            $scope.data.isDefault = 0;
        }
    }

    //保存地址
    $scope.keepDeliveryAddress = function(dataForm) {
        var data = {
            contacts: $scope.data.contacts,
            mobileNumber: $scope.data.mobileNumber,
            countyId: $scope.data.countyId,
            address: $scope.data.address,
            isDefault: $scope.data.isDefault
        }
        if ($scope.data.addressId) {
            angular.extend(data, { addressId: $scope.data.addressId });
        }
        $net.post('/CRUD/CRUD-U-IBS-Public-saveUserAddress.do', data).then(function(res) {
            if (res.success) {
                userFactory.showAlert($ionicPopup, $scope, '上传成功', $ionicHistory);
            } else {
                userFactory.showAlert($ionicPopup, $scope, res.msg);
            }
        })
    }

    // 删除地址
    $scope.showConfirm = function() {
        var optionsPopup = $ionicPopup.show({
            title: '提示',
            templateUrl: 'templates/popview/delAddress.html',
            buttons: [{
                text: '取消',
                type: 'button-default',
                onTap: function(e) {
                    return false;
                }
            }, {
                text: '确定',
                okType: 'button-positive',
                onTap: function(e) {
                    return true;
                }
            }]
        });
        optionsPopup.then(function(res) {
            if (res) {
                $net.post('/CRUD/CRUD-U-IBS-Public-delUserAddress.do', {
                    addressId: $scope.data.addressId,
                }).then(function(res) {
                    if (res.success) {
                        userFactory.showAlert($ionicPopup, $scope, '删除成功', $ionicHistory);
                    } else {
                        userFactory.showAlert($ionicPopup, $scope, '删除失败');
                    }
                })
            }
        });
        var htmlEl = angular.element(document.querySelector('html')); //点击罩层外关闭弹框
        htmlEl.on('click', function(event) {
            if (event.target.nodeName === 'HTML') {
                if (optionsPopup) {
                    optionsPopup.close();
                }
            }
        });
    };

});