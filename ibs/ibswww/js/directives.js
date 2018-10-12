angular.module('starter.directives', [])
    .directive('rjCloseBackDrop', function() {
        return {
            scope: false,
            restrict: 'A',
            replace: false,
            link: function($scope, iElm, iAttrs, controller) {
                var htmlEl = angular.element(document.querySelector('html'));
                htmlEl.on("click", function(event) {
                    if (event.target.nodeName === "HTML") {
                        $scope.optionsPopup.close();
                    }
                });
            }
        };

    })

.directive('repeatFinish', function($timeout) {
    return {
        link: function(scope, element, attr) {
            if (scope.$last == true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
})

.directive("inputUppercase", function() {
    return {
        require: "ngModel",
        restrict: "A",
        link: function(scope, elem, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.push(function(value) {
                return elem.val(value.toUpperCase()) && value.toUpperCase();
            });
        }
    }
})


.directive('focusInput', ['$timeout', '$ionicPosition', function($timeout, $ionicPosition) {
    return {
        restrict: 'A',
        scope: false,
        link: function($scope, iElm, iAttrs, controller) {
            if (ionic.Platform.isIOS()) {
                iElm.on('focus', function() {
                    $timeout(function() {
                        var aim = angular.element(document.querySelector('.modal'))
                        aim.css('bottom', '' + 246 + 'px');
                    }, 100)

                })

                iElm.on('blur', function() {
                    var aim = angular.element(document.querySelector('.modal'))
                    aim.css('bottom', '' + 0 + 'px');
                })
            }

        }
    }
}])


.directive('newsRedPoint', function($compile, $timeout) {
    return {
        restrict: 'A',
        replace: false,
        link: function(scope, element, attrs, controller) {
            var key = attrs.newsRedPoint || false;
            var template = "<span ng-class={true:'news-red-point',false:''}[" + key + "]></span>";
            var html = $compile(template)(scope);
            $timeout(function() {
                var test = angular.element(element).parent().append(html)
            }, 100)

        }
    };
})

.directive('photoImg', function() {
    return {
        restrict: 'E',
        templateUrl: "templates/photoswipe.html",
        replace: true
    }
})

.filter('unique', function() {
    return function(collection) {
        var res = [];
        var json = {};

        angular.forEach(collection, function(data) {
            if (!json[data]) {
                res.push(data);
                json[data] = 1;
            }
        });

        return res;
    };
});