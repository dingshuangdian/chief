angular.module('starter.controllers')

.controller('insureProgressCtrl', function($scope, LoadingView, $ionicPopup, $net, $ionicHistory, $localCache, $state, $ionicScrollDelegate, $stateParams, userFactory, $rootScope) {
    $scope.search = {};
    $scope.insureProgressTabs = [
        { name: '已退回' },
        { name: '待核保' },
        { name: '待支付' },
        { name: '待收单' },
        { name: '已完成' }
    ];
    //待核保接口数据
    $scope.cUrl_ = '/CRUD/CRUD-Q-IBS-Order-qryUnderwritingOrder.do';
    $scope.isShow = true;
    $scope.selectTabWithIndex = function(e) {
        $scope.slectIndex = e;
        if (e == 0) {
            //已退回数据
            $scope.cUrl_ = '/CRUD/CRUD-Q-IBS-Order-qryBackOrder.do';
        } else if (e == 1) {
            //待核保数据
            $scope.cUrl_ = '/CRUD/CRUD-Q-IBS-Order-qryUnderwritingOrder.do';
        } else if (e == 2) {
            //待支付数据
            $scope.cUrl_ = '/CRUD/CRUD-Q-IBS-Order-qryPayOrder.do';
        } else if (e == 3) {
            //待收单数据
            $scope.cUrl_ = '/CRUD/CRUD-Q-IBS-Order-qryIssuingOrder.do';
        } else {
            //已完成数据
            $scope.cUrl_ = '/CRUD/CRUD-Q-IBS-Order-qryFinishOrder.do';
        }

        $net.post($scope.cUrl_, {}, {
            isLoading: 1
        }).then(function(res) {
            if (res.success) {
                if (res.result == null) {
                    $scope.isShow = false;
                } else {
                    $scope.isShow = true;
                    $scope.mes = res.result;
                }

                for (var i in $scope.mes) {
                    $scope.showBtnType($scope.mes[i].opFlag);
                }
                $ionicScrollDelegate.scrollTop(true);
            } else {
                userFactory.showAlert($ionicPopup, $scope, res.msg);
            }
        })
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        if ($stateParams.num != null) {
            $scope.first = true;
            $scope.slectIndex = $stateParams.num;
            if ($stateParams.num == 0) {
                //已退回数据
                $scope.cUrl_ = '/CRUD/CRUD-Q-IBS-Order-qryBackOrder.do';
            } else if ($stateParams.num == 1) {
                //待核保数据
                $scope.cUrl_ = '/CRUD/CRUD-Q-IBS-Order-qryUnderwritingOrder.do';
            } else if ($stateParams.num == 2) {
                //待支付数据
                $scope.cUrl_ = '/CRUD/CRUD-Q-IBS-Order-qryPayOrder.do';
            } else if ($stateParams.num == 3) {
                //待收单数据
                $scope.cUrl_ = '/CRUD/CRUD-Q-IBS-Order-qryIssuingOrder.do';
            } else {
                //已完成数据
                $scope.cUrl_ = '/CRUD/CRUD-Q-IBS-Order-qryFinishOrder.do';
            }
        }

        if (!$scope.first) {
            $scope.slectIndex = 1;
            $scope.cUrl_ = '/CRUD/CRUD-Q-IBS-Order-qryUnderwritingOrder.do';
            $scope.first = true;
        }
        $net.post($scope.cUrl_, {}, {
            isLoading: 1
        }).then(function(res) {
            LoadingView.hide();
            if (res.success) {
                if (res.result == null) {
                    $scope.isShow = false;
                } else {
                    $scope.isShow = true;
                    $scope.mes = res.result;
                }

                for (var i in $scope.mes) {
                    $scope.showBtnType($scope.mes[i].opFlag);
                }
                $ionicScrollDelegate.scrollTop(true);
            } else {
                userFactory.showAlert($ionicPopup, $scope, res.msg);
            }
        })
    });


    //下拉刷新
    $scope.doRefresh = function() {
        $net.post($scope.cUrl_, {}, {
            isLoading: 1
        }).then(function(res) {
            if (res.success) {
                if (res.result == null) {
                    $scope.isShow = false;
                } else {
                    $scope.isShow = true;
                    $scope.mes = res.result;
                }

                for (var i in $scope.mes) {
                    $scope.showBtnType($scope.mes[i].opFlag);
                }
                $ionicScrollDelegate.scrollTop(true);
            } else {
                userFactory.showAlert($ionicPopup, $scope, res.msg);
            }
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.showBtnType = function(opFlag) {
        $scope.isOneOrTwo = true;
        $scope.orderMes = false;
        $scope.addMes = false;
        $scope.delOrder = false;
        $scope.applyUnderwriting = false;
        $scope.makeAppointment = false;
        $scope.reBid = false;
        $scope.sureOrder = false;
        $scope.changePolicy = false;

        if ((opFlag & 1) > 0) {
            $scope.orderMes = true;
            $scope.isOneOrTwo = false;
        }
        if ((opFlag & 2) > 0) {
            $scope.addMes = true;
            $scope.isOneOrTwo = true;
        }
        if ((opFlag & 4) > 0) {
            $scope.delOrder = true;
            $scope.isOneOrTwo = true;
        }
        if ((opFlag & 8) > 0) {
            $scope.applyUnderwriting = true;
            $scope.isOneOrTwo = true;
        }
        if ((opFlag & 16) > 0) {
            $scope.reBid = true;
            $scope.isOneOrTwo = true;
        }
        if ((opFlag & 32) > 0) {
            $scope.makeAppointment = true;
            $scope.isOneOrTwo = true;
        }
        if ((opFlag & 64) > 0) {
            $scope.sureOrder = true;
            $scope.isOneOrTwo = true;
        }
        if ((opFlag & 128) > 0) {
            $scope.changePolicy = true;
            $scope.isOneOrTwo = true;
        }
        if ((opFlag & 256) > 0) {
            $scope.orderPay = true;
            $scope.isOneOrTwo = true;
        }
    }

    $scope.toDetails = function(orderTags, orderId) {
        $scope.titleName = '保单详情';
        $scope.gUrl = 'backDetails';
        $scope.isShowOrHide = 1;
        if (orderTags == 2) {
            $scope.gUrl = 'backDetails';
            $scope.isShowOrHide = 2;
        } else if (orderTags == 4) {
            $scope.titleName = '报价详情';
            $scope.gUrl = 'underwritingDetails';
        } else if (orderTags == 8) {
            $scope.gUrl = 'underwritingDetails';
            $scope.isShowOrHide = 2;
        } else if (orderTags == 16) {
            $scope.gUrl = 'underwritingDetails';
            $scope.isShowOrHide = 3;
        } else if (orderTags == 32) {
            $scope.gUrl = 'backDetails';
            $scope.isShowOrHide = 3;
        } else if (orderTags == 64) {
            $scope.gUrl = 'underwritingDetails';
            $scope.isShowOrHide = 3;
        } else if (orderTags == 128) {
            $scope.gUrl = 'sureDetails';
        } else if (orderTags == 256) {
            $scope.gUrl = 'sureDetails';
            $scope.isShowOrHide = 2;
        } else if (orderTags == 2048) {
            $scope.gUrl = 'backDetails';
            $scope.isShowOrHide = 4;
        };
        $state.go($scope.gUrl, {
            title: $scope.titleName,
            btnFlag: $scope.isShowOrHide,
            orderId: orderId
        });
    };

    // 删除订单
    $scope.showConfirm = function(oid) {
        $net.post('/CRUD/CRUD-U-IBS-Order-removeOrder.do', {
            orderId: oid,
        }).then(function(res) {
            if (res.success) {
                $localCache.set('orderId', oid);
                $net.post($scope.cUrl_, {}).then(function(res) {
                    if (res.success) {
                        if (res.result == null) {
                            $scope.isShow = false;
                        } else {
                            $scope.isShow = true;
                            $scope.mes = res.result;
                        }
                        for (var i in $scope.mes) {
                            $scope.showBtnType($scope.mes[i].opFlag);
                        }
                    } else {
                        userFactory.showAlert($ionicPopup, $scope, res.msg);
                    }
                })
            } else {
                userFactory.showAlert($ionicPopup, $scope, '删除失败');
            }
        })

        // var optionsPopup = $ionicPopup.show({

        //     title: '提示',
        //     templateUrl: 'templates/popview/confirm.html',
        //     buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
        //         text: '取消',
        //         type: 'button-default',
        //         onTap: function(e) {
        //             // 当点击时，e.preventDefault() 会阻止弹窗关闭。
        //             return false;
        //         }
        //     }, {
        //         text: '确定',
        //         okType: 'button-positive',
        //         onTap: function(e) {
        //             // 返回的值会导致处理给定的值。
        //             return true;
        //         }
        //     }]
        // });
        // optionsPopup.then(function(res) {
        //     if (res) {
        //         $net.post('/CRUD/CRUD-U-IBS-Order-removeOrder.do', {
        //             orderId: oid,
        //         }).then(function(res) {
        //             if (res.success) {
        //                 $localCache.set('orderId', oid);
        //                 userFactory.showAlert($ionicPopup, $scope, '删除成功', false, function() {
        //                     //刷新
        //                     $net.post($scope.cUrl_, {}).then(function(res) {
        //                         if (res.success) {
        //                             if (res.result == null) {
        //                                 $scope.isShow = false;
        //                             } else {
        //                                 $scope.isShow = true;
        //                                 $scope.mes = res.result;
        //                             }
        //                             for (var i in $scope.mes) {
        //                                 $scope.showBtnType($scope.mes[i].opFlag);
        //                             }
        //                         } else {
        //                             userFactory.showAlert($ionicPopup, $scope, res.msg);
        //                         }
        //                     })
        //                 });
        //             } else {
        //                 userFactory.showAlert($ionicPopup, $scope, '删除失败');
        //             }
        //         })
        //     }
        // });
        var htmlEl = angular.element(document.querySelector('html')); //点击罩层外关闭弹框
        htmlEl.on('click', function(event) {
            if (event.target.nodeName === 'HTML') {
                if (optionsPopup) {
                    optionsPopup.close();
                }
            }
        });
    };

    //重新报价
    $scope.chongXinBaojia = function(orderId) {
        if (orderId != null) {
            $state.go('selectInsurance', { orderId: orderId, router: 3 });
        } else {
            userFactory.showAlert($ionicPopup, $scope, '缺少参数');
        }
    };
    // 修改保单
    $scope.toChangePolicy = function(orderId) {
        if (orderId != null) {
            $state.go('selectInsurance', { orderId: orderId, router: 6 });
        } else {
            userFactory.showAlert($ionicPopup, $scope, '缺少参数');
        }
    };

    //预约出单
    $scope.toFillInfo = function(orderId) {
        if (orderId != null) {
            $state.go('fillInfo', { orderId: orderId });
        } else {
            userFactory.showAlert($ionicPopup, $scope, '缺少参数');
        }
    };

    //立即支付
    $scope.toPayOrder = function(orderId) {
        if (orderId != null) {
            $state.go('insurancePolicyPay', { orderId: orderId });
        } else {
            userFactory.showAlert($ionicPopup, $scope, '缺少参数');
        }
    }

    //申请核保
    $scope.toUnderwriting = function(orderId) {

        if (orderId != null) {
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
            // $state.go('uploadData', { orderId: orderId });
            $state.go('supplementaryInfo', { orderId: orderId });
        } else {
            userFactory.showAlert($ionicPopup, $scope, '缺少参数');
        }
    }

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
                type: 'button-positive',
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
                        userFactory.showAlert($ionicPopup, $scope, '收单成功', false, function() {
                            //刷新
                            $net.post($scope.cUrl_, {}).then(function(res) {
                                if (res.success) {
                                    if (res.result == null) {
                                        $scope.isShow = false;
                                    } else {
                                        $scope.isShow = true;
                                        $scope.mes = res.result;
                                    }
                                    for (var i in $scope.mes) {
                                        $scope.showBtnType($scope.mes[i].opFlag);
                                    }
                                } else {
                                    userFactory.showAlert($ionicPopup, $scope, res.msg);
                                }
                            })
                        });
                    } else {
                        userFactory.showAlert($ionicPopup, $scope, '收单失败');
                    }
                })
            }
        });
    };

    //车险进度搜索
    $scope.searchOrder = function() {
        $net.post($scope.cUrl_, {
            licenseNo: $scope.search.carNum
        }, {
            isLoading: 1
        }).then(function(res) {
            if (res.success) {
                if (res.result == null) {
                    $scope.isShow = false;
                } else {
                    $scope.isShow = true;
                    $scope.mes = res.result;
                }
                for (var i in $scope.mes) {
                    $scope.showBtnType($scope.mes[i].opFlag);
                }
            } else {

            }
        })
    }

    $rootScope.$on("disPayOfInsurancePolicy", function(event, data) {
        // console.log("当前节点" + event.currentScope.name + ",截获到了来自" + data.divName + "的事件：" + event.name + "，它的作用是" + data.description);
        $scope.selectTabWithIndex(3);
    });

})

.controller('anticipateProfitCtrl', function(userFactory, $scope, $ionicPopup, $state, $net, $ionicHistory, $rootScope, $localCache) { //预计收益列表

    if (!$localCache.get('tokenId')) {
        $rootScope.loginTag = false;
    } else {
        $rootScope.loginTag = true;
    }
    // $scope.$watch('loginTag', function() {
    //     if ($rootScope.loginTag) {
    //         $scope.doRefresh();
    //     }
    // });

    $scope.$on('$ionicView.beforeEnter', function() {
        if (!$rootScope.IBSpj) {
            $ionicHistory.clearHistory()
        }
        if ($rootScope.loginTag) {
            $scope.doRefresh();
        }
    })

    $scope.search = {};
    $scope.isShow = true;

    $scope.toDetails = function(num) {
        $state.go('profitDetail', {
            orderId: num
        });
    };

    var cUrl_ = '/CRUD/CRUD-U-IBS-Order-getAnticipateIncomeList.do';
    // $net.post(cUrl_, {}).then(function(res) {
    //     if (res.success) {
    //         if (res.result == null) {
    //             $scope.isShow = false;
    //         } else {
    //             $scope.isShow = true;
    //             $scope.anticipateProfitDate = res.result;
    //         }
    //     } else {
    //         $scope.isShow = false;
    //         userFactory.showAlert($ionicPopup, $scope, res.msg);
    //     }
    // });

    //下拉刷新
    $scope.doRefresh = function() {
        $net.post(cUrl_, {}, { isLoading: 1 }).then(function(res) {
            if (res.success) {
                if (res.result == null) {
                    $scope.isShow = false;
                } else {
                    $scope.isShow = true;
                    $scope.anticipateProfitDate = res.result;
                }
            } else {

            }
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    //搜索
    $scope.searchOrder = function() {
        $net.post(cUrl_, {
            licenseNo: $scope.search.carNum
        }, { isLoading: 1 }).then(function(res) {
            if (res.success) {
                if (res.result == null) {
                    $scope.isShow = false;
                } else {
                    $scope.isShow = true;
                    $scope.anticipateProfitDate = res.result;
                }
            } else {

            }
        })
    }


    $scope.backNavi = function() {
        if (device.platform != "Android") {
            cordova.BSTool.backNavi();
        } else {
            navigator.app.exitApp();
        }

    }

})

.filter('length', function() {
    return function(textNumber) {
        var textLength = textNumber.length;
        return textLength;
    };
})