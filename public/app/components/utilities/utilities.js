(function (window, angular) {
    "use strict";

    function stUtilities() {
        return {
            restrict: 'AEC',
            templateUrl: '../public/app/components/utilities/utilities.html',
            controller: 'UtilitiesCtrl as utilitiesCtrl'
        };
    }

    function UtilitiesCtrl(StorageService) {
        var vm;

        vm = this;

    }

    UtilitiesCtrl.$inject = [];

    angular.module('station')
        .controller('UtilitiesCtrl', UtilitiesCtrl)
        .directive('stUtilities', stUtilities);

}(window, window.angular));