angular.module('starter.services', [])

.factory('userFactory', function() {
    return {
        showAlert: function($ionicPopup, $scope, alertMessage, $ionicHistory, callback) {
            $scope.popupContent = alertMessage || "链接失败，请再尝试！";
            var alertPopup = $ionicPopup.alert({
                templateUrl: "templates/popview/showAlert1.html",
                scope: $scope,
                buttons: [{
                    text: '<b>确定</b>',
                    type: 'button-clear',
                    onTap: function(e) {
                        // alertPopup.close();
                        // return e;
                    }
                }, ]
            });
            alertPopup.then(function(res) {
                alertPopup.close();
                if ($ionicHistory) {
                    $ionicHistory.goBack();
                }
                if (callback) callback();
            });
            var htmlEl = angular.element(document.querySelector('html')); //点击罩层外关闭弹框
            htmlEl.on('click', function(event) {
                if (event.target.nodeName === 'HTML') {
                    if (alertPopup) {
                        alertPopup.close();
                    }
                }
            });

        }
    }
})

.factory('ModalService', ['$ionicModal', '$rootScope', '$controller', '$timeout',
    function($ionicModal, $rootScope, $controller, $timeout) {
        return {
            show: show
        };

        function show(templateUrl, controller, noAnimation) {
            var ctrlInstance,
                modalScope = $rootScope.$new(),
                thisScopeId = modalScope.$id;

            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: modalScope,
                animation: 'slide-in-up',
                noAnimation: noAnimation
            }).then(function(modal) {
                modalScope.modal = modal;

                modalScope.openModal = function() {
                    modalScope.modal = show();
                };

                modalScope.closeModal = function() {
                    modalScope.modal.hide();
                };

                modalScope.$on('modal.hidden', function(thisModal) {
                    if (thisModal.currentScope) {
                        var modalScopeId = thisModal.currentScope.$id;
                        if (thisScopeId === modalScopeId) {
                            _cleanup(thisModal.currentScope);
                        }
                    }
                });

                var locals = {
                    '$scope': modalScope
                };

                ctrlInstance = $controller(controller, locals);


                modalScope.modal.show();

            });
        }

        function _cleanup(scope) {
            scope.$destroy();
            if (scope.modal) {
                $timeout(function() {
                    scope.modal.remove();
                }, 500);
            }
        }
    }
])

.factory('autoLogin', ['$net', '$rootScope', '$localCache', '$timeout', 'LoadingView', function($net, $rootScope, $localCache, $timeout, LoadingView) {

    return {
        action: function(tokenId) {
        if(tokenId){
            $localCache.set('tokenId', tokenId);

            // $net.post('/CRUD/CRUD-CQ-IBS-Auth-login.do', {
            //     lgiName: username,
            //     lgiPwd: password
            // }).then(function(res) {
            //     if (res.success) {
            //         LoadingView.hide();
            //         $localCache.set('tokenId', res.result.tokenId);
            //         $rootScope.loginTag = true;
            //     } else {
            //         LoadingView.show(res.msg);
            //         $timeout(function() {
            //             if (device.platform != "Android") {
            //                 cordova.BSTool.backNavi();
            //             } else {
            //                 navigator.app.exitApp();
            //             }
            //         }, 3000)

            //     }
            // })
        }
        $rootScope.loginTag = true;
        }

    }
}]);
