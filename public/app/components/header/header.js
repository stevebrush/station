(function (window, angular) {
    "use strict";

    function stHeader() {
        return {
            restrict: 'AEC',
            scope: true,
            bindToController: {},
            templateUrl: '../public/app/components/header/header.html',
            controller: 'HeaderController as headerCtrl'
        };
    }

    function HeaderController($scope) {
        var vm;

        vm = this;

        $scope.$on('header:updated', function (e, data) {
            vm = angular.merge(vm, data);
        });

        vm.goBack = function () {
            vm.backButtonCallback.call();
        };
    }

    HeaderController.$inject = [
        '$scope'
    ];

    angular.module('station')
        .controller('HeaderController', HeaderController)
        .directive('stHeader', stHeader);

}(window, window.angular));
