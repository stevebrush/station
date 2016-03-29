(function (window, angular) {
    "use strict";

    function stUtilities() {
        return {
            restrict: 'AEC',
            templateUrl: '../public/app/components/utilities/utilities.html',
            controller: 'UtilitiesController as utilitiesCtrl'
        };
    }

    function UtilitiesController() {
        var vm;
        vm = this;
    }

    UtilitiesController.$inject = [];

    angular.module('station')
        .controller('UtilitiesController', UtilitiesController)
        .directive('stUtilities', stUtilities);

}(window, window.angular));
