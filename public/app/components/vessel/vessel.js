(function (angular) {
    'use strict';

    function stVessel() {
        return {
            restrict: 'E',
            replace: true,
            bindToController: {
                owner: '=',
                itemActions: '='
            },
            controller: 'VesselController as vesselCtrl',
            templateUrl: '../public/app/components/vessel/vessel.html'
        };
    }

    function VesselController(CharacterService, utils, VesselFactory) {
        var player,
            vm;

        vm = this;
        vm.vessel = VesselFactory.make(vm.owner);

        CharacterService.getPlayer().then(function (data) {
            player = data;
        });

        vm.takeAllItems = function () {
            player.backpack.addItems(vm.vessel.removeAllItems());
            vm.vessel.open();
        };
    }

    VesselController.$inject = [
        'CharacterService',
        'utils',
        'VesselFactory'
    ];

    angular.module('station')
        .controller('VesselController', VesselController)
        .directive('stVessel', stVessel);

}(window.angular));
