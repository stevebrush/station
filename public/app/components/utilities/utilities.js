(function (window, angular) {
    "use strict";

    function stUtilities() {
        return {
            restrict: 'E',
            templateUrl: '../public/app/components/utilities/utilities.html',
            controller: 'UtilitiesController as utilitiesCtrl'
        };
    }

    function UtilitiesController(CharacterService) {
        var vm;
        vm = this;
        CharacterService.getPlayer().then(function (data) {
            vm.player = data;
        });
    }

    UtilitiesController.$inject = [
        'CharacterService'
    ];

    angular.module('station')
        .controller('UtilitiesController', UtilitiesController)
        .directive('stUtilities', stUtilities);

}(window, window.angular));
