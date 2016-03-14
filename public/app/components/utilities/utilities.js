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

        vm.save = function () {
            console.log("Save game1");
            /**
             * When user clicks "save", retrieve all locally changed items, and push them to local storage.
             */
        };

        vm.reset = function () {
            console.log("Reset game1");
        };
    }

    UtilitiesCtrl.$inject = [
        'StorageService'
    ];

    angular.module('station')
        .controller('UtilitiesCtrl', UtilitiesCtrl)
        .directive('stUtilities', stUtilities);

}(window, window.angular));