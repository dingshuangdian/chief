angular.module('starter.controllers')
    .controller('AllExpireDataCtrl', function($scope, $validate, userFactory, $ionicPopup, LoadingView, $filter, $ionicLoading, $ionicHistory, ionicDatePicker, $state, $net, $localCache, $rootScope, $stateParams, $ionicModal) {
        $scope.search = {};

        var url = '/CRUD/CRUD-Q-IBS-Insurance-getExpireInsuranceList.do'
            //获取到期车险列表
        $scope.getExpireInsuranceList = function() {
            $net.get(url).then(function(res) {
                if (res.success) {
                    $scope.insuranceList = res.result.rows;
                } else {
                    userFactory.showAlert($ionicPopup, $scope, res.msg);
                }
            })
        };
        $scope.getExpireInsuranceList();
        //获取保险公司列表
        $scope.getInsuranceComList = function() {
            $net.post('/CRUD/CRUD-Q-IBS-Insurance-getInsuranceComList.do').then(function(res) {
                if (res.success && res.result) {
                    $scope.comList = res.result;
                } else {
                    userFactory.showAlert($ionicPopup, $scope, res.msg);
                }
            })
        };
        $scope.getInsuranceComList();

        //下拉刷新
        $scope.doRefresh = function() {
            $net.get(url).then(function(res) {
                if (res.success) {
                    $scope.insuranceList = res.result.rows;
                } else {
                    userFactory.showAlert($ionicPopup, $scope, res.msg);
                }
            }).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
        // $scope.toDetail = function(num) {
        //     $state.go('insuranceDetail', {
        //         titel: '续保详情',
        //         btnMessgage: '一键报价',
        //         licenseNo: num
        //     });
        // };


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
        //内容检索
        $scope.research = function(licenseNo) {
            $net.post(url, {
                licenseNo: licenseNo
            }).then(function(res) {
                if (res.success) {
                    $scope.insuranceList = res.result.rows;
                } else {
                    userFactory.showAlert($ionicPopup, $scope, res.msg);
                }
            })
        };


        $scope.changeOrder = function(sort) {
            $scope.params = {
                sord: sort == 0 ? 'asc' : 'desc'
            };
            $net.post(url, $scope.params).then(function(res) {
                if (res.success) {
                    $scope.insuranceList = res.result.rows;
                } else {
                    userFactory.showAlert($ionicPopup, $scope, res.msg);
                }
            })
        };

        $scope.search.companyName = 4;
        $scope.changeCompany = function(companyName) {
            $net.post(url, {
                insuranceComId: companyName
            }).then(function(res) {
                if (res.success) {
                    $scope.insuranceList = res.result.rows;
                } else {
                    userFactory.showAlert($ionicPopup, $scope, res.msg);
                }
            })
        }




    })