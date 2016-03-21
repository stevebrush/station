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

    function HeaderController($scope, $rootScope, HeaderService) {
        var vm;

        vm = this;
        vm.showBackButton = false;

        $scope.$on('header:updated', function (e, data) {
            vm.title = data.title;
        });

        vm.goBack = function () {
            $rootScope.state.back();
        };
    }

    function HeaderService($rootScope) {
        var service;

        service = {};
        service.title = "";

        service.setTitle = function (val) {
            service.title = val;
            $rootScope.$broadcast('header:updated', service);
        };

        return service;
    }

    HeaderController.$inject = [
        '$scope',
        '$rootScope',
        'HeaderService'
    ];
    HeaderService.$inject = [
        '$rootScope'
    ];

    angular.module('station')
        .controller('HeaderController', HeaderController)
        .directive('stHeader', stHeader)
        .service('HeaderService', HeaderService);

}(window, window.angular));