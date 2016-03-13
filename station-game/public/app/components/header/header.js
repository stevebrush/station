(function (window, angular) {
    "use strict";

    function stHeader() {
        return {
            restrict: 'AEC',
            scope: true,
            bindToController: {},
            templateUrl: '../public/app/components/header/header.html',
            controller: 'HeaderCtrl as headerCtrl'
        };
    }

    function HeaderCtrl() {
        var vm;

        vm = this;
    }

    HeaderCtrl.$inject = [];

    angular.module('station')
        .controller('HeaderCtrl', HeaderCtrl)
        .directive('stHeader', stHeader);

}(window, window.angular));