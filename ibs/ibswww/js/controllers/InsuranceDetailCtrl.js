angular.module('starter.controllers')

.controller('insuranceDetailCtrl', function($scope, $ionicPopup, userFactory, LoadingView, $state, $net, $stateParams, $ionicHistory) {
    $scope.$on('$ionicView.beforeEnter', function() {
        LoadingView.loadShowLongTime('数据加载中，请稍等片刻......');
    })
    $scope.detailsTitle = $stateParams.titel;
    $scope.detailsBtn = $stateParams.btnMessgage;

    $scope.showDetailBT = '查看详情';
    $scope.showDetail = function() {
        $scope.isShowDetail = !$scope.isShowDetail;
        $scope.showDetailBT = $scope.isShowDetail ? '收起详情' : '查看详情';
    }
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
            $net.post('/CRUD/CRUD-Q-IBS-Insurance-getInsuranceInfo.do', {
                licenseNo: $stateParams.licenseNo
            }).then(function(res) {
                if (res.success) {
                    LoadingView.hide();
                    $scope.getInsuranceInfo = res.result;

                    $scope.getInsuranceInfo.sanZhe = $scope.insureenumval['sanZhe'][$scope.getInsuranceInfo.sanZhe];
                    $scope.getInsuranceInfo.boLi = $scope.insureenumval['boLi'][$scope.getInsuranceInfo.boLi];
                    $scope.getInsuranceInfo.chengKe = $scope.insureenumval['chengKe'][$scope.getInsuranceInfo.chengKe];
                    $scope.getInsuranceInfo.huaHen = $scope.insureenumval['huaHen'][$scope.getInsuranceInfo.huaHen];
                    $scope.getInsuranceInfo.siJi = $scope.insureenumval['siJi'][$scope.getInsuranceInfo.siJi];
                    $scope.getInsuranceInfo.hcXiulichang = $scope.insureenumval['hcXiulichang'][$scope.getInsuranceInfo.hcXiulichang];
                    $scope.getInsuranceInfo.daoQiang = $scope.getInsuranceInfo.daoQiang == 0 ? '不投保' : $scope.getInsuranceInfo.daoQiang;
                    $scope.getInsuranceInfo.ziRan = $scope.getInsuranceInfo.ziRan == 0 ? '不投保' : $scope.getInsuranceInfo.ziRan;
                    $scope.getInsuranceInfo.sheShui = $scope.getInsuranceInfo.sheShui == 0 ? '不投保' : $scope.getInsuranceInfo.sheShui;
                    $scope.getInsuranceInfo.cheSun = $scope.getInsuranceInfo.cheSun == 0 ? '不投保' : $scope.getInsuranceInfo.cheSun;
                    $scope.getInsuranceInfo.hcSanfangteyue = $scope.getInsuranceInfo.hcSanfangteyue == 0 ? '不投保' : $scope.getInsuranceInfo.hcSanfangteyue;
                    if ($scope.getInsuranceInfo == null) {
                        $scope.isShow = false;
                    } else {
                        $scope.isShow = true;
                    }
                } else {
                    $scope.isShow = true;
                    LoadingView.hide();
                    userFactory.showAlert($ionicPopup, $scope, res.msg, $ionicHistory, callback);

                    function callback() {
                        $ionicHistory.clearCache();
                        $state.go('BSApp');
                    };
                }
            });
        })
    }
    $scope.init();

    $scope.quoteCertain = function() {
        $state.go('plccOfferDetails', {
            router: 5,
            licenseNo: $stateParams.licenseNo,
            quoteGroup: 4,
            carVin: $scope.getInsuranceInfo.carVin,
            insureAgentUname: $scope.getInsuranceInfo.insureAgentUname
        });

    }
});