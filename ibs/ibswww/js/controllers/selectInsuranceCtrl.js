angular.module('starter.controllers')
    .controller('selectInsuranceCtrl', function($scope, $validate, userFactory, $ionicPopup, LoadingView, $filter, $ionicLoading, $ionicHistory, ionicDatePicker, $state, $net, $localCache, $rootScope, $stateParams, $ionicModal) {

        $scope.data = {};
        $scope.info = {};
        $scope.info1 = {};
        $scope.postData = {};
        $scope.agentName = $stateParams.agentName;
        $scope.insureAgentUid = $stateParams.userId;
        // $scope.downUp = '收起';
        // $scope.menuState = { show: true };
        // $scope.toggleDown = function() {
        //     $scope.menuState.show = !$scope.menuState.show;
        //     $scope.downUp = $scope.menuState.show ? '收起' : '展开';
        // }
        // $scope.$on('$destroy', function() {
        //     $scope.carOrArtificial = '';
        // })
        $scope.$on('$ionicView.beforeEnter', function() {
            $scope.init();
            if ($rootScope.modleName) {
                //$scope.info.modleName = $rootScope.modleName;
            }
        })

        $scope.openDatePickerOne = function() { //时间插件
            var ipObj1 = {
                callback: function(val) { //Mandatory
                    $scope.info.nextForceStartdate = $filter("date")(val, "yyyy-MM-dd");
                },
                disabledDates: [ //Optional

                ],
                from: new Date(), //Optional
                to: new Date(2030, 10, 30), //Optional
                inputDate: new Date(), //Optional
                mondayFirst: true, //Optional
                disableWeekdays: [], //Optional
                closeOnSelect: false, //Optional
                templateType: 'popup' //Optional

            };
            ionicDatePicker.openDatePicker(ipObj1);
        };
        $scope.openDatePickerTwo = function() {
            var ipObj1 = {
                callback: function(val) { //Mandatory
                    $scope.info.nextBusinessStartdate = $filter("date")(val, "yyyy-MM-dd");
                },
                disabledDates: [ //Optional

                ],
                from: new Date(), //Optional
                to: new Date(2030, 10, 30), //Optional
                inputDate: new Date(), //Optional
                mondayFirst: true, //Optional
                disableWeekdays: [], //Optional
                closeOnSelect: false, //Optional
                templateType: 'popup' //Optional

            };
            ionicDatePicker.openDatePicker(ipObj1);
        };
        //
        // 获取续保信息
        // $scope.info.hcXiuLiCan = false;
        //$scope.holderPartytypeId = 1;

        $scope.init = function() {
            LoadingView.loadShowLongTime('数据加载中，请稍等......');
            $net.post('/CRUD/CRUD-Q-IBS-Public-getIDCardtype.do').then(function(res) { //获取证件信息
                if (res.success) {
                    $scope.cardType = res.result;
                } else {
                    LoadingView.hide();
                    $scope.popupContent = res.msg;
                    $scope.alertPopup = $ionicPopup.show({
                        templateUrl: "templates/popview/showAlert.html",
                        scope: $scope
                    });
                    $scope.backOther = function() {
                        $scope.alertPopup.close();
                        $ionicHistory.goBack();
                    };
                }
            }).then(function() {
                $net.post('/CRUD/CRUD-Q-IBS-Public-getInsureenumval.do').then(function(res) { //获取保险金额信息
                    if (res.success) {
                        $scope.sanZheVal = res.result.sanZhe;
                        $scope.siJiVal = res.result.siJi;
                        $scope.boLiVal = res.result.boLi;
                        $scope.huaHenVal = res.result.huaHen;
                        $scope.chengKeVal = res.result.chengKe;
                        $scope.xiuLiChangVal = res.result.xiulichangType;
                        $scope.xiuLiChangGuochan = res.result.xiuLiChangGuochan;
                        $scope.xiuLiChangJinkou = res.result.xiuLiChangJinkou;
                    } else {
                        LoadingView.hide();
                        $scope.popupContent = res.msg;
                        $scope.alertPopup = $ionicPopup.show({
                            templateUrl: "templates/popview/showAlert.html",
                            scope: $scope
                        });
                        $scope.backOther = function() {
                            $scope.alertPopup.close();
                            $ionicHistory.goBack();
                        };
                    }
                })
            }).then(function() {
                $net.post('/CRUD/CRUD-Q-IBS-Public-getHolderPartytype.do').then(function(res) { //获取单位个人信息
                    if (res.success) {
                        $scope.holderPartytypes = res.result;
                    } else {
                        LoadingView.hide();
                        $scope.popupContent = res.msg;
                        $scope.alertPopup = $ionicPopup.show({
                            templateUrl: "templates/popview/showAlert.html",
                            scope: $scope
                        });
                        $scope.backOther = function() {
                            $scope.alertPopup.close();
                            $ionicHistory.goBack();
                        };
                    }
                })
            }).then(function() {
                $net.get('/CRUD/CRUD-Q-IBS-Insurance-getInsureAgentUList.do').then(function(res) { //获取跟进人员列表
                    if (res.success) {
                        $scope.insureAgent = res.result;

                    } else {
                        LoadingView.hide();
                        $scope.popupContent = res.msg;
                        $scope.alertPopup = $ionicPopup.show({
                            templateUrl: "templates/popview/showAlert.html",
                            scope: $scope
                        });
                        $scope.backOther = function() {
                            $scope.alertPopup.close();
                            $ionicHistory.goBack();
                        };
                    }
                })

            }).then(function() {
                if ($stateParams.router == 1) { //自动报价
                    $scope.recordBool = true;
                    $scope.isShow = true;
                    $scope.cityCode = $stateParams.cityCode;
                    $scope.getReinfo();
                } else if ($stateParams.router == 2) { //人工报价
                    LoadingView.hide();
                    $scope.recordBool = false;
                    $scope.isShow = false;
                    $scope.isRenewalDate = false;

                    $scope.info.nextForceStartdate = new Date().toLocaleDateString();
                    $scope.info.nextBusinessStartdate = new Date().toLocaleDateString();
                    $scope.info.sanZheBaoE = 0;
                    $scope.info.siJiBaoE = 0;
                    $scope.info.chengKeBaoE = 0;
                    $scope.info.boLiBaoE = 0;
                    $scope.info.huahenBaoE = 0;
                    $scope.info.hcXiuLiCanBaoE = 0;
                    $scope.info.hcXiulichangBaoE = 0;
                    $scope.info.isForceRenewalDate = 2;
                    $scope.info.isBusinessRenewalDate = 2;
                    // $scope.selectCardName = 1;

                } else if ($stateParams.router == 3) { //重新报价
                    $scope.recordBool = true;
                    $scope.isShow = true;

                    // $scope.isRenewalDate = false;

                    $scope.orderId = $stateParams.orderId;
                    $scope.orderDetail();
                } else if ($stateParams.router == 6) { //修改保单
                    $scope.recordBool = false;
                    $scope.isShow = false;
                    $scope.isRenewalDate = false;

                    // $scope.isRenewalDate = false;

                    $scope.orderId = $stateParams.orderId;
                    $scope.orderDetail();
                }
            })
        };
        $scope.getReinfo = function() { //获取上一年续保信息
            $net.post('/CRUD/CRUD-Q-IBS-Insurance-getInsuranceInfo.do', {
                licenseNo: $stateParams.licenseNo,
                cityCode: $stateParams.cityCode
            }, { timeout: 1000 * 60 * 3 }).then(function(res) {
                // $rootScope.carType = '';
                if (res.success) {
                    LoadingView.hide();
                    if (res.result == null) {
                        userFactory.showAlert($ionicPopup, $scope, '无法读取上一年续保信息,请转人工核保！', $ionicHistory, callback);

                        function callback() {
                            $ionicHistory.clearCache();
                            $state.go('BSApp');
                        };
                    } else {
                        var data = res.result;
                        $scope.info = data;
                        if ($scope.info.isForceRenewalDate > 0 || $scope.info.isBusinessRenewalDate > 0) {
                            $scope.isRenewalDate = false;
                        } else {
                            $scope.isRenewalDate = true;
                        }
                        if (res.result.holderIdCard && res.result.holderIdCardType) {
                            $scope.data.infoHolderType = 1;
                        } else {
                            $scope.data.infoHolderType = 2;
                        }
                        if (res.result.insuredIdCard && res.result.insuredIdCardType) {
                            $scope.data.infoType = 1;
                        } else {
                            $scope.data.infoType = 2;
                        }

                        $scope.info.sanZheBaoE = data.sanZhe;
                        $scope.info.siJiBaoE = data.siJi;
                        $scope.info.chengKeBaoE = data.chengKe;
                        $scope.info.boLiBaoE = data.boLi;
                        $scope.info.huahenBaoE = data.huaHen;
                        $scope.info.hcXiuLiCanBaoE = data.hcXiulichangType;
                        $scope.info.hcXiulichangBaoE = data.hcXiulichang;
                        // $scope.selectCardName = data.insuredIdCardType;

                        $scope.info.licenseNo = data.licenseNo;
                        $scope.info.carownerName = data.carownerName;
                        $scope.info.carownerCard = data.carownerCard;
                        $scope.info.carownerCardTypeName = data.carownerCardTypeName;
                        $scope.info.carVin = data.carVin;
                        $scope.info.engineNo = data.engineNo;
                        $scope.info.modleName = data.modleName;
                        $scope.info.autoMoldcode = data.autoMoldcode;
                        $scope.info.registerDate = data.registerDate;
                        $scope.info.insuredName = data.insuredName;
                        $scope.info.insuredIdCard = data.insuredIdCard;
                        // $scope.info.insuredIdCard = data.insuredIdCard.replace(data.insuredIdCard.substr(10, 6), "******");
                        $scope.info.insuredMobile = data.insuredMobile;
                        $scope.info.nextForceStartdate = data.nextForceStartdate;
                        $scope.info.nextBusinessStartdate = data.nextBusinessStartdate;

                        if (data.seatCount == null || data.seatCount == '') {
                            $scope.info.seatCount = 5;
                        } else {
                            $scope.info.seatCount = data.seatCount;
                        }

                        $scope.info.bujimianChesunTag = data.bujimianChesun > 0 ? true : false;
                        $scope.info.bujimianChengkeTag = data.bujimianChengke > 0 ? true : false;
                        $scope.info.bujimianDaoqiangTag = data.bujimianDaoqiang > 0 ? true : false;
                        $scope.info.bujimianHuahenTag = data.bujimianHuahen > 0 ? true : false;
                        $scope.info.bujimianSanzheTag = data.bujimianSanzhe > 0 ? true : false;
                        $scope.info.bujimianSheshuiTag = data.bujimianSheshui > 0 ? true : false;
                        $scope.info.bujimianSijiTag = data.bujimianSiji > 0 ? true : false;
                        $scope.info.bujimianZiranTag = data.bujimianZiran > 0 ? true : false;
                        $scope.info.sheShuiTag = data.sheShui > 0 ? true : false;
                        $scope.info.cheSunTag = data.cheSun > 0 ? true : false;
                        $scope.info.boLiTag = data.boLi > 0 ? true : false;
                        $scope.info.chengKeTag = data.chengKe > 0 ? true : false;
                        $scope.info.daoQiangTag = data.daoQiang > 0 ? true : false;
                        $scope.info.siJiTag = data.siJi > 0 ? true : false;
                        $scope.info.ziRanTag = data.ziRan > 0 ? true : false;
                        $scope.info.sanZheTag = data.sanZhe > 0 ? true : false;
                        $scope.info.huaHenTag = data.huaHen > 0 ? true : false;
                        $scope.info.hcSanfangteyueTag = data.hcSanfangteyue > 0 ? true : false;
                        // $scope.info.hcXiulichangTag = $scope.info.hcXiulichang > 0 ? true : false;
                        $scope.info.hcXiulichangTypeTag = $scope.info.hcXiulichangType > 0 ? true : false;
                        $scope.info.forceTag = true;
                        $scope.newholderCardName = 1;
                        $scope.newselectCardName = 1;
                        $scope.info.memo = '';

                        if ($rootScope.vehicleInfo) {
                            $scope.info.vehicleTags = true;
                            $scope.info.autoMoldcode = $rootScope.vehicleInfo.VehicleNo;
                            $scope.info.purchasePrice = $rootScope.vehicleInfo.PurchasePrice;
                            $scope.info.exhaustScale = $rootScope.vehicleInfo.VehicleExhaust;
                            $scope.info.seatCount = Number($rootScope.vehicleInfo.VehicleSeat);
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
        }

        $scope.showMessage = function() {
            if ($scope.info.infoType == '2') {
                $scope.info.newinsuredName = "";
                $scope.newselectCardName = 1;
                $scope.info.newinsuredIdCard = "";
                $scope.info.newinsuredMobile = "";
            }
            if ($scope.data.infoHolderType == '2') {
                $scope.info.newholderName = "";
                $scope.newholderCardName = 1;
                $scope.info.newholderIdCard = "";
                $scope.info.newholderMobile = "";
            }
        }


        $scope.chooseCar = function() {
            $state.go('selectModel', {
                modleName: $scope.info.modleName,
                licenseNo: $scope.info.licenseNo,
                autoMoldcode: $scope.info.autoMoldcode
            });
        };
        $scope.orderDetail = function() { //<!--保单详情 -->
            $net.post('/CRUD/CRUD-Q-IBS-Order-qryOrderInfo.do', {
                orderId: $scope.orderId
            }).then(function(res) {

                if (res.success) {
                    LoadingView.hide();
                    var data = res.result;
                    $scope.info = data;

                    if ($scope.info.isForceRenewalDate > 0 || $scope.info.isBusinessRenewalDate > 0) {
                        $scope.isRenewalDate = false;
                    } else {
                        $scope.isRenewalDate = true;
                    };

                    if (res.result.holderIdCard && res.result.holderIdCardType) {
                        $scope.data.infoHolderType = 1;
                    } else {
                        $scope.data.infoHolderType = 2;
                    }
                    if (res.result.insuredIdCard && res.result.insuredIdCardType) {
                        $scope.data.infoType = 1;
                    } else {
                        $scope.data.infoType = 2;
                    }

                    $scope.info.sanZheBaoE = data.sanZhe;
                    $scope.info.siJiBaoE = data.siJi || 0;
                    $scope.info.chengKeBaoE = data.chengKe || 0;
                    $scope.info.boLiBaoE = data.boLi || 0;
                    $scope.info.huahenBaoE = data.huaHen || 0;
                    if (data.hcXiulichangType == null) {
                        $scope.info.hcXiuLiCanBaoE = 0;
                    } else {
                        $scope.info.hcXiuLiCanBaoE = data.hcXiulichangType;
                    }
                    if (data.hcXiulichang == null) {
                        $scope.info.hcXiulichangBaoE = 0;
                    } else {
                        $scope.info.hcXiulichangBaoE = data.hcXiulichang;
                    }

                    // $scope.selectCardName = data.insuredIdCardType;
                    $scope.agentName = data.insureAgentUname;
                    $scope.insureAgentUid = data.insureAgentUid;
                    $scope.cityCode = data.cityCode;
                    $scope.info.licenseNo = data.licenseNo;
                    $scope.info.carownerName = data.carownerName;
                    $scope.info.carownerCard = data.carownerCard;
                    $scope.info.carownerCardTypeName = data.carownerCardTypeName;
                    $scope.info.carVin = data.carVin;
                    $scope.info.engineNo = data.engineNo;
                    $scope.info.modleName = data.modleName;
                    $scope.info.registerDate = data.registerDate;
                    $scope.info.insuredName = data.insuredName;
                    $scope.info.insuredIdCard = data.insuredIdCard;
                    $scope.info.insuredMobile = data.insuredMobile;
                    $scope.info.nextForceStartdate = data.forceStartDate;
                    $scope.info.nextBusinessStartdate = data.businessStartDate;
                    $scope.info.seatCount = data.seatCount;
                    $scope.info.bujimianChesunTag = data.bujimianChesun > 0 ? true : false;
                    $scope.info.bujimianChengkeTag = data.bujimianChengke > 0 ? true : false;
                    $scope.info.bujimianDaoqiangTag = data.bujimianDaoqiang > 0 ? true : false;
                    $scope.info.bujimianHuahenTag = data.bujimianHuahen > 0 ? true : false;
                    $scope.info.bujimianSanzheTag = data.bujimianSanzhe > 0 ? true : false;
                    $scope.info.bujimianSheshuiTag = data.bujimianSheshui > 0 ? true : false;
                    $scope.info.bujimianSijiTag = data.bujimianSiji > 0 ? true : false;
                    $scope.info.bujimianZiranTag = data.bujimianZiran > 0 ? true : false;
                    $scope.info.sheShuiTag = data.sheShui > 0 ? true : false;
                    $scope.info.cheSunTag = data.cheSun > 0 ? true : false;
                    $scope.info.boLiTag = data.boLi > 0 ? true : false;
                    $scope.info.chengKeTag = data.chengKe > 0 ? true : false;
                    $scope.info.daoQiangTag = data.daoQiang > 0 ? true : false;
                    $scope.info.siJiTag = data.siJi > 0 ? true : false;
                    $scope.info.ziRanTag = data.ziRan > 0 ? true : false;
                    $scope.info.sanZheTag = data.sanZhe > 0 ? true : false;
                    $scope.info.huaHenTag = data.huaHen > 0 ? true : false;
                    $scope.info.hcSanfangteyueTag = data.hcSanfangteyue > 0 ? true : false;
                    // $scope.info.hcXiulichangTag = $scope.info.hcXiulichang > 0 ? true : false;
                    $scope.info.hcXiulichangTypeTag = $scope.info.hcXiulichangType > 0 ? true : false;
                    $scope.info.memo = '';

                    $scope.info.forceTag = true;
                    $scope.newselectCardName = 1;
                    $scope.newselectCardName = 1;

                    if ($rootScope.vehicleInfo) {
                        $scope.info.vehicleTags = true;
                        $scope.info.autoMoldcode = $rootScope.vehicleInfo.VehicleNo;
                        $scope.info.purchasePrice = $rootScope.vehicleInfo.PurchasePrice;
                        $scope.info.exhaustScale = $rootScope.vehicleInfo.VehicleExhaust;
                        $scope.info.seatCount = $rootScope.vehicleInfo.VehicleSeat;
                    }

                } else {
                    LoadingView.hide();
                    userFactory.showAlert($ionicPopup, $scope, '无法读取上一年续保信息,请转人工核保！', $ionicHistory, callback);

                    function callback() {
                        $ionicHistory.clearCache();
                        $state.go('BSApp');
                    };
                }
            });

        };
        //复选框
        var valmap = {
            'sanZheTag': 500000,
            'siJiTag': 10000,
            'chengKeTag': 10000,
            'boLiTag': 1,
            'huaHenTag': 10000,
            'hcXiulichangTypeTag': 1,
            'hcXiulichangTag': 0.1
        };

        $scope.changeSelect = function(info, key1, key2, valBaoE) {

            if (key2 == 'cheSunTag') {
                if ($scope.info['cheSunTag']) {
                    $scope.info['hcSanfangteyueTag'] = true;
                } else {
                    $scope.info['hcSanfangteyueTag'] = false;
                }
            }

            info[key1] = info[key2];
            if (info[key2]) {
                $scope.info[valBaoE] = valmap[key2];
            } else {
                $scope.info[valBaoE] = 0;
            }
        };

        $scope.changeSelect0 = function(info, key1, key2, valBaoE) {
            info[key1] = info[key2];
            if ($scope.info.chengKeTag == true) {
                $scope.info.seatCount = 5;
            } else {
                $scope.info.seatCount = "";
            }
            if (info[key2]) {
                $scope.info[valBaoE] = valmap[key2];
            } else {
                $scope.info[valBaoE] = 0;
            }
        };

        $scope.changeSelect1 = function(info, key1, key2, valBaoE, hcXiulichangBaoE) {
            info[key1] = info[key2];
            if (info[key2]) {
                $scope.info[valBaoE] = valmap[key2];
                $scope.info[hcXiulichangBaoE] = valmap[key1];
            } else {
                $scope.info[valBaoE] = 0;
                $scope.info[hcXiulichangBaoE] = 0;
            }
        };
        $scope.changeCheck = function() {
            if ($scope.info.hcXiuLiCanBaoE > 0) {
                $scope.info.hcXiulichangTypeTag = true;
                $scope.info.hcXiulichangBaoE = 0.1;
            } else {
                $scope.info.hcXiulichangTypeTag = false;
                $scope.info.hcXiulichangBaoE = 0;
            }

        };
        $scope.changeUnCheck = function(key1, key2, valBaoE) {
            if ($scope.info[valBaoE] > 0) {
                $scope.info[key1] = true;
                $scope.info[key2] = true;
            } else {
                $scope.info[key1] = false;
                $scope.info[key2] = false;

            }
        };
        // $scope.changeCardName = function(selectCardName) {
        //     $scope.selectCardName = selectCardName;
        // };
        $scope.agentModalShow = function() {

            $scope.Name = $scope.agentName;
            $scope.id = $scope.insureAgentUid;
            //更换跟踪人员
            $ionicModal.fromTemplateUrl('templates/modal/agentModal.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
                $scope.choice = $scope.insureAgentUid;
                $scope.isSelect = function(id, e, name) {
                    if (e.target.checked) {
                        $scope.id = id;
                        $scope.Name = name;
                    }
                }

            });
            $scope.modalHide = function() {
                $scope.agentName = $scope.Name;
                $scope.insureAgentUid = $scope.id;
                $scope.modal.hide();
            };
        }

        $scope.changePartytype = function(holderPartytypeId) {
            $scope.holderPartytypeId = holderPartytypeId;
        };
        $scope.goHome = function() {
            $state.go('BSApp');
        };
        $scope.getValue = function() {
            if ($scope.info.isForceRenewalDate > 0) {
                if ($scope.info.forceTag) {
                    $scope.forceTag = 1;
                } else {
                    $scope.forceTag = 0;
                };
            } else {
                $scope.forceTag = 0;
            }

            if ($scope.info.cheSunTag) {
                $scope.cheSunTag = 1;
            } else {
                $scope.cheSunTag = 0;
            };
            if ($scope.info.bujimianChesunTag) {
                $scope.bujimianChesunTag = 1;
            } else {
                $scope.bujimianChesunTag = 0;
            };
            if ($scope.info.sanZheTag) {
                $scope.sanZheTag = $scope.info.sanZheBaoE;
            } else {
                $scope.sanZheTag = 0;
            };
            if ($scope.info.bujimianSanzheTag) {
                $scope.bujimianSanzheTag = 1;
            } else {
                $scope.bujimianSanzheTag = 0;
            };
            if ($scope.info.daoQiangTag) {
                $scope.daoQiangTag = 1;
            } else {
                $scope.daoQiangTag = 0;
            };
            if ($scope.info.bujimianDaoqiangTag) {
                $scope.bujimianDaoqiangTag = 1;
            } else {
                $scope.bujimianDaoqiangTag = 0;
            };
            if ($scope.info.siJiTag) {
                $scope.siJiTag = $scope.info.siJiBaoE;
            } else {
                $scope.siJiTag = 0;
            };
            if ($scope.info.bujimianSijiTag) {
                $scope.bujimianSijiTag = 1;
            } else {
                $scope.bujimianSijiTag = 0;
            };
            if ($scope.info.chengKeTag) {
                $scope.chengKeTag = $scope.info.chengKeBaoE;
            } else {
                $scope.chengKeTag = 0;
            };
            if ($scope.info.bujimianChengkeTag) {
                $scope.bujimianChengkeTag = 1;
            } else {
                $scope.bujimianChengkeTag = 0;
            };
            if ($scope.info.boLiTag) {
                $scope.boLiTag = $scope.info.boLiBaoE;
            } else {
                $scope.boLiTag = 0;
            };
            if ($scope.info.huaHenTag) {

                $scope.huaHenTag = $scope.info.huahenBaoE;

            } else {
                $scope.huaHenTag = 0;
            };
            if ($scope.info.bujimianHuahenTag) {
                $scope.bujimianHuahenTag = 1;
            } else {
                $scope.bujimianHuahenTag = 0;
            };
            if ($scope.info.sheShuiTag) {
                $scope.sheShuiTag = 1;
            } else {
                $scope.sheShuiTag = 0;
            };
            if ($scope.info.bujimianSheshuiTag) {
                $scope.bujimianSheshuiTag = 1;
            } else {
                $scope.bujimianSheshuiTag = 0;
            };
            if ($scope.info.ziRanTag) {
                $scope.ziRanTag = 1;
            } else {
                $scope.ziRanTag = 0;
            };
            if ($scope.info.bujimianZiranTag) {
                $scope.bujimianZiranTag = 1;
            } else {
                $scope.bujimianZiranTag = 0;
            };
            if ($scope.info.hcSanfangteyueTag) {
                $scope.hcSanfangteyueTag = 1;
            } else {
                $scope.hcSanfangteyueTag = 0;
            };

            if ($scope.info.hcXiuLiCanBaoE > 0) {
                $scope.hcXiulichangTypeTag = $scope.info.hcXiuLiCanBaoE;
                $scope.hcXiulichangTag = $scope.info.hcXiulichangBaoE;
            } else {
                $scope.hcXiulichangTypeTag = 0;
                $scope.hcXiulichangTag = 0;
            };
            if ($scope.info.seatCount) {
                $scope.info.seatCount = $scope.info.seatCount;
            } else {
                $scope.info.seatCount = '';
            }
        };
        $scope.carOrArtificial = $stateParams;

        $scope.nextIST = function(list) { //自动下一步

            $scope.getValue();
            $scope.paramsList = {
                cityCode: $scope.cityCode,
                insureAgentUid: $scope.insureAgentUid,
                insureAgentUname: $scope.agentName,
                licenseNo: $scope.info.licenseNo,
                carownerName: $scope.info.carownerName,
                carownerCard: $scope.info.carownerCard,
                carVin: $scope.info.carVin,
                engineNo: $scope.info.engineNo,
                modleName: $scope.info.modleName,
                registerDate: $scope.info.registerDate,
                holderPartytype: $scope.holderPartytypeId || '',
                holderName: $scope.info.holderName,
                holderIdCard: $scope.info.holderIdCard,
                holderMobile: $scope.info.holderMobile,
                holderIdCardType: $scope.info.holderIdCardType,
                insuredName: $scope.info.insuredName,
                insuredIdCard: $scope.info.insuredIdCard,
                insuredMobile: $scope.info.insuredMobile,
                insuredIdCardType: $scope.info.insuredIdCardType,
                forceStartDate: $scope.info.nextForceStartdate,
                businessStartDate: $scope.info.nextBusinessStartdate,
                seatCount: $scope.info.seatCount,
                force: $scope.forceTag,
                cheSun: $scope.cheSunTag,
                bujimianChesun: $scope.bujimianChesunTag,
                sanZhe: $scope.sanZheTag,
                bujimianSanzhe: $scope.bujimianSanzheTag,
                daoQiang: $scope.daoQiangTag,
                bujimianDaoqiang: $scope.bujimianDaoqiangTag,
                siJi: $scope.siJiTag,
                bujimianSiji: $scope.bujimianSijiTag,
                chengKe: $scope.chengKeTag,
                bujimianChengke: $scope.bujimianChengkeTag,
                boLi: $scope.boLiTag,
                huaHen: $scope.huaHenTag,
                bujimianHuahen: $scope.bujimianHuahenTag,
                sheShui: $scope.sheShuiTag,
                bujimianSheshui: $scope.bujimianSheshuiTag,
                ziRan: $scope.ziRanTag,
                bujimianZiran: $scope.bujimianZiranTag,
                hcSanfangteyue: $scope.hcSanfangteyueTag,
                hcXiulichangType: $scope.hcXiulichangTypeTag,
                hcXiulichang: $scope.hcXiulichangTag,
                memo: $scope.info.memo || ''
            };

            if ($scope.data.infoHolderType == 2) {
                $scope.paramsList.holderName = $scope.info.newholderName || '';
                $scope.paramsList.holderIdCard = $scope.info.newholderIdCard || '';
                $scope.paramsList.holderMobile = $scope.info.newholderMobile || '';
                $scope.paramsList.holderIdCardType = $scope.newholderCardName || '';
            } else { //取上一年信息
                $scope.paramsList.holderName = $scope.info.holderName || '';
                $scope.paramsList.holderIdCard = $scope.info.holderIdCard || '';
                $scope.paramsList.holderMobile = $scope.info.holderMobile || '';
                $scope.paramsList.holderIdCardType = $scope.info.holderIdCardType || '';
            }

            if ($scope.data.infoType == 2) {
                $scope.paramsList.insuredName = $scope.info.newinsuredName || '';
                $scope.paramsList.insuredIdCard = $scope.info.newinsuredIdCard || '';
                $scope.paramsList.insuredMobile = $scope.info.newinsuredMobile || '';
                $scope.paramsList.insuredIdCardType = $scope.newselectCardName || '';
            } else { //取上一年信息
                $scope.paramsList.insuredName = $scope.info.insuredName || '';
                $scope.paramsList.insuredIdCard = $scope.info.insuredIdCard || '';
                $scope.paramsList.insuredMobile = $scope.info.insuredMobile || '';
                $scope.paramsList.insuredIdCardType = $scope.info.insuredIdCardType || '';
            }
            //更换车型
            if ($scope.info.autoMoldcode && $scope.info.vehicleTags) {
                $scope.paramsList.autoMoldcode = $scope.info.autoMoldcode || '';
                $scope.paramsList.purchasePrice = $scope.info.purchasePrice || '';
                $scope.paramsList.exhaustScale = $scope.info.exhaustScale || '';
            }
            $scope.carOrArtificial.list = $scope.paramsList;
            $scope.carOrArtificial.router = $stateParams.router;

            function goNext() {

                if ($scope.carOrArtificial.list.insuredName == '') {
                    userFactory.showAlert($ionicPopup, $scope, '请填写被保人姓名！');
                    return false;
                }
                if ($scope.carOrArtificial.list.insuredIdCardType == 1) {
                    if (!$validate.isCardID($scope.carOrArtificial.list.insuredIdCard)) {
                        userFactory.showAlert($ionicPopup, $scope, '被保人证件号码格式不正确！');
                        return false;
                    }
                } else {
                    if ($scope.carOrArtificial.list.insuredIdCard == '') {
                        userFactory.showAlert($ionicPopup, $scope, '请填写被保人证件号码！');
                        return false;
                    }
                }

                if ($scope.carOrArtificial.list.holderName == '') {
                    userFactory.showAlert($ionicPopup, $scope, '请填写投保人姓名！');
                    return false;
                }
                if ($scope.carOrArtificial.list.holderIdCardType == 1) {
                    if (!$validate.isCardID($scope.carOrArtificial.list.holderIdCard)) {
                        userFactory.showAlert($ionicPopup, $scope, '投保人证件号码格式不正确！');
                        return false;
                    }
                } else {
                    if ($scope.carOrArtificial.list.holderIdCard == '') {
                        userFactory.showAlert($ionicPopup, $scope, '请填写投保人证件号码！');
                        return false;
                    }
                }
                if ($scope.chengKeTag) {
                    if ($scope.info.seatCount == "" || $scope.info.seatCount == 0) {
                        userFactory.showAlert($ionicPopup, $scope, '请填写座位数！');
                        return false;
                    }
                }
                $state.go('selectCompany', $scope.carOrArtificial);
            }

            if (!$scope.forceTag && !$scope.cheSunTag && !$scope.sanZheTag && !$scope.daoQiangTag && !$scope.siJiTag && !$scope.chengKeTag && !$scope.boLiTag && !$scope.huaHenTag && !$scope.sheShuiTag && !$scope.ziRanTag && !$scope.hcSanfangteyueTag && !$scope.hcXiulichangTypeTag) {
                userFactory.showAlert($ionicPopup, $scope, '请至少选择一种险种！');
                return false;
            } else {
                if ($scope.forceTag) {
                    if (!$scope.info.nextForceStartdate) {
                        userFactory.showAlert($ionicPopup, $scope, '请选择交险起保时间！');
                        return false;
                    } else {
                        if (!$scope.cheSunTag && !$scope.sanZheTag && !$scope.daoQiangTag && !$scope.siJiTag && !$scope.chengKeTag && !$scope.boLiTag && !$scope.huaHenTag && !$scope.sheShuiTag && !$scope.ziRanTag && !$scope.hcSanfangteyueTag && !$scope.hcXiulichangTypeTag) {
                            goNext();
                            return false;
                        } else {
                            if (!$scope.info.nextBusinessStartdate) {
                                userFactory.showAlert($ionicPopup, $scope, '请选择商业险起保时间！');
                                return false;
                            } else {
                                goNext();
                                return false;
                            }
                        }
                    }
                } else if ($scope.cheSunTag || $scope.sanZheTag || $scope.daoQiangTag || $scope.siJiTag || $scope.chengKeTag || $scope.boLiTag || $scope.huaHenTag || $scope.sheShuiTag || $scope.ziRanTag || $scope.hcSanfangteyueTag || $scope.hcXiulichangTypeTag) {
                    if (!$scope.info.nextBusinessStartdate) {
                        userFactory.showAlert($ionicPopup, $scope, '请选择商业险起保时间！');
                        return false;
                    } else {
                        if ($scope.forceTag) {
                            if (!$scope.info.nextForceStartdate) {
                                userFactory.showAlert($ionicPopup, $scope, '请选择交强险起保时间！');
                                return false;
                            } else {
                                goNext();
                                return false;
                            }
                        } else {
                            goNext();
                            return false;
                        }
                    }
                }

            }
            // if (!$scope.info.nextForceStartdate && !$scope.info.nextBusinessStartdate) {
            //     if ($scope.forceTag) {
            //         userFactory.showAlert($ionicPopup, $scope, '请选择交强险起保时间！');
            //         return false;
            //     } else if ($scope.cheSunTag || $scope.sanZheTag || $scope.daoQiangTag || $scope.siJiTag || $scope.chengKeTag || $scope.boLiTag || $scope.huaHenTag || $scope.sheShuiTag || $scope.ziRanTag || $scope.hcSanfangteyueTag || $scope.hcXiulichangTypeTag) {
            //         userFactory.showAlert($ionicPopup, $scope, '请选择商业险起保时间！');
            //         return false;
            //     } else {
            //         userFactory.showAlert($ionicPopup, $scope, '请至少选择一种险种起保时间！');
            //         return false;
            //     }

            // } else {
            //     if ($scope.info.nextForceStartdate) {
            //         if (!$scope.forceTag) {
            //             userFactory.showAlert($ionicPopup, $scope, '请选择交强险！');
            //             return false;
            //         } else {
            //             if ($scope.info.nextBusinessStartdate) {
            //                 if (!$scope.cheSunTag && !$scope.sanZheTag && !$scope.daoQiangTag && !$scope.siJiTag && !$scope.chengKeTag && !$scope.boLiTag && !$scope.huaHenTag && !$scope.sheShuiTag && !$scope.ziRanTag && !$scope.hcSanfangteyueTag && !$scope.hcXiulichangTypeTag) {
            //                     userFactory.showAlert($ionicPopup, $scope, '请至少选择一项商业险！');
            //                     return false;
            //                 } else {
            //                     goNext();
            //                 }

            //             } else {
            //                 if (!$scope.cheSunTag && !$scope.sanZheTag && !$scope.daoQiangTag && !$scope.siJiTag && !$scope.chengKeTag && !$scope.boLiTag && !$scope.huaHenTag && !$scope.sheShuiTag && !$scope.ziRanTag && !$scope.hcSanfangteyueTag && !$scope.hcXiulichangTypeTag) {
            //                     goNext();
            //                 } else {
            //                     userFactory.showAlert($ionicPopup, $scope, '请选择商业险起保时间！');
            //                     return false;
            //                 }
            //             }

            //         }
            //     } else if ($scope.info.nextBusinessStartdate) {
            //         if (!$scope.forceTag && !$scope.cheSunTag && !$scope.sanZheTag && !$scope.daoQiangTag && !$scope.siJiTag && !$scope.chengKeTag && !$scope.boLiTag && !$scope.huaHenTag && !$scope.sheShuiTag && !$scope.ziRanTag && !$scope.hcSanfangteyueTag && !$scope.hcXiulichangTypeTag) {
            //             userFactory.showAlert($ionicPopup, $scope, '请至少选择一种商业险！');
            //             return false;
            //         } else {
            //             if ($scope.info.nextForceStartdate) {
            //                 if (!$scope.forceTag) {
            //                     userFactory.showAlert($ionicPopup, $scope, '请选择交强险！');
            //                     return false;
            //                 } else {
            //                     goNext();
            //                 }
            //             } else {
            //                 if (!$scope.forceTag) {
            //                     goNext();
            //                 } else {
            //                     userFactory.showAlert($ionicPopup, $scope, '请选择交强险起保时间！');
            //                     return false;
            //                 }
            //             }
            //         }
            //     }
            // }

        };
        $scope.manualCheck = function() { //人工下一步
            $scope.getValue();
            if ($stateParams.router == 2) {
                $scope.paramsList = {
                    cityCode: $stateParams.cityCode,
                    insureAgentUid: $scope.insureAgentUid,
                    insureAgentUname: $scope.agentName,
                    holderPartytype: $scope.holderPartytypeId,
                    insuredName: $scope.info.insuredName,
                    holderName: $scope.info.holderName,
                    forceStartDate: $scope.info.nextForceStartdate,
                    businessStartDate: $scope.info.nextBusinessStartdate,
                    seatCount: $scope.info.seatCount,
                    force: $scope.forceTag,
                    cheSun: $scope.cheSunTag,
                    bujimianChesun: $scope.bujimianChesunTag,
                    sanZhe: $scope.sanZheTag,
                    bujimianSanzhe: $scope.bujimianSanzheTag,
                    daoQiang: $scope.daoQiangTag,
                    bujimianDaoqiang: $scope.bujimianDaoqiangTag,
                    siJi: $scope.siJiTag,
                    bujimianSiji: $scope.bujimianSijiTag,
                    chengKe: $scope.chengKeTag,
                    bujimianChengke: $scope.bujimianChengkeTag,
                    boLi: $scope.boLiTag,
                    huaHen: $scope.huaHenTag,
                    bujimianHuahen: $scope.bujimianHuahenTag,
                    sheShui: $scope.sheShuiTag,
                    bujimianSheshui: $scope.bujimianSheshuiTag,
                    ziRan: $scope.ziRanTag,
                    bujimianZiran: $scope.bujimianZiranTag,
                    hcSanfangteyue: $scope.hcSanfangteyueTag,
                    hcXiulichangType: $scope.hcXiulichangTypeTag,
                    hcXiulichang: $scope.hcXiulichangTag,
                    memo: $scope.info.memo || ''
                };
            } else {
                $scope.paramsList = {
                    cityCode: $stateParams.cityCode,
                    insureAgentUid: $scope.insureAgentUid,
                    insureAgentUname: $scope.agentName,
                    holderPartytype: $scope.holderPartytypeId,
                    insuredName: $scope.info.insuredName,
                    insuredIdCard: $scope.info.insuredIdCard,
                    insuredMobile: $scope.info.insuredMobile,
                    insuredIdCardType: $scope.info.insuredIdCardType,
                    forceStartDate: $scope.info.nextForceStartdate,
                    businessStartDate: $scope.info.nextBusinessStartdate,
                    seatCount: $scope.info.seatCount,
                    force: $scope.forceTag,
                    cheSun: $scope.cheSunTag,
                    bujimianChesun: $scope.bujimianChesunTag,
                    sanZhe: $scope.sanZheTag,
                    bujimianSanzhe: $scope.bujimianSanzheTag,
                    daoQiang: $scope.daoQiangTag,
                    bujimianDaoqiang: $scope.bujimianDaoqiangTag,
                    siJi: $scope.siJiTag,
                    bujimianSiji: $scope.bujimianSijiTag,
                    chengKe: $scope.chengKeTag,
                    bujimianChengke: $scope.bujimianChengkeTag,
                    boLi: $scope.boLiTag,
                    huaHen: $scope.huaHenTag,
                    bujimianHuahen: $scope.bujimianHuahenTag,
                    sheShui: $scope.sheShuiTag,
                    bujimianSheshui: $scope.bujimianSheshuiTag,
                    ziRan: $scope.ziRanTag,
                    bujimianZiran: $scope.bujimianZiranTag,
                    hcSanfangteyue: $scope.hcSanfangteyueTag,
                    hcXiulichangType: $scope.hcXiulichangTypeTag,
                    hcXiulichang: $scope.hcXiulichangTag,
                    memo: $scope.info.memo || ''
                };
                if ($stateParams.router == 6) {
                    $scope.paramsList.cityCode = $scope.cityCode;
                    $scope.paramsList.orderId = $scope.info.orderId;
                }

            }

            $scope.carOrArtificial.list = $scope.paramsList;
            if ($scope.chengKeTag) {
                if ($scope.info.seatCount == "" || $scope.info.seatCount == 0) {
                    userFactory.showAlert($ionicPopup, $scope, '请填写座位数！');
                    return false;
                }
            }
            if (!$scope.info.insuredName) {
                userFactory.showAlert($ionicPopup, $scope, '请输入被保人姓名！');
                return false;
            } else if (!$scope.forceTag && !$scope.cheSunTag && !$scope.sanZheTag && !$scope.daoQiangTag && !$scope.siJiTag && !$scope.chengKeTag && !$scope.boLiTag && !$scope.huaHenTag && !$scope.sheShuiTag && !$scope.ziRanTag && !$scope.hcSanfangteyueTag && !$scope.hcXiulichangTypeTag) {
                userFactory.showAlert($ionicPopup, $scope, '请至少选择一种险种！');
                return false;
            }
            // else if ($scope.chengKeTag) {
            //     if ($scope.info.seatCount=="") {
            //     userFactory.showAlert($ionicPopup, $scope, '请填写座位数！'); 
            //     return false;
            //     }else{
            //         $scope.info.seatCount=$scope.info.seatCount;
            //     }

            // }
            else {
                $state.go('selectCompany', $scope.carOrArtificial);
            }

        };

    })