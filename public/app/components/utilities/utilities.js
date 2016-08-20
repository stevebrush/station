(function (window, angular) {
    "use strict";

    function stUtilities() {
        return {
            restrict: 'E',
            templateUrl: '../public/app/components/utilities/utilities.html',
            controller: 'UtilitiesController as utilitiesCtrl'
        };
    }

    function UtilitiesController($scope, CharacterService) {
        var player,
            vm;

        vm = this;

        CharacterService.getPlayer().then(function (data) {
            player = data;
            vm.health = player.getStatus('health');
            vm.vitality = player.getAttribute('vitality');
        });

        $scope.$on('player:attacked', function (e, args) {
            vm.health = args.health;
            vm.message = args.message;
        });
    }

    UtilitiesController.$inject = [
        '$scope',
        'CharacterService'
    ];

    angular.module('station')
        .controller('UtilitiesController', UtilitiesController)
        .directive('stUtilities', stUtilities);

}(window, window.angular));
