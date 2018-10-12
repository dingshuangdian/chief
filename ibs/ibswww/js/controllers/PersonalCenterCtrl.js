angular.module('starter.controllers')

.controller('anticipateProfitCtrl', function($scope, $state) {
    $scope.toProfitDetail = function() {
        $state.go('profitDetail');
    }
})


.controller('profitDetailCtrl', function($scope) {

});