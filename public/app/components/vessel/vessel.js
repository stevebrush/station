(function (angular) {
    'use strict';

    function stVessel() {
        return {
            restrict: 'E',
            replace: true,
            bindToController: {
                owner: '='
            },
            controller: 'VesselController as vesselCtrl',
            templateUrl: '../public/app/components/vessel/vessel.html'
        };
    }

    function VesselController($interval, CharacterService, utils, VesselFactory) {
        var vm;

        vm = this;
        vm.owner = VesselFactory.make(vm.owner);
        vm.itemActions = [{ Take: 'takeItem' }];
        vm.isOpen = false;

        CharacterService.getPlayer().then(function (data) {
            vm.visitor = data.backpack;
            vm.isReady = true;
        });

        function swap(vessel) {
            var temp = vm.visitor;
            vm.visitor = vessel;
            vm.owner = temp;
        }

        vm.toggleBackpack = function () {
            vm.isBackpackVisible = (vm.isBackpackVisible) ? false : true;
            if (vm.isBackpackVisible) {
                vm.itemActions = [{ Move: 'moveItem' }];
            } else {
                vm.itemActions = [{ Take: 'takeItem' }];
            }
            swap(vm.owner);
        };

        vm.open = function () {
            vm.isOpen = (vm.isOpen) ? false : true;
            if (vm.isBackpackVisible) {
                vm.isBackpackVisible = false;
                swap(vm.owner);
            }
        };

        vm.takeAllItems = function () {
            vm.visitor.addItems(vm.owner.removeAllItems());
            vm.open();
        };
    }

    VesselController.$inject = [
        '$interval',
        'CharacterService',
        'utils',
        'VesselFactory'
    ];

    angular.module('station')
        .controller('VesselController', VesselController)
        .directive('stVessel', stVessel);

}(window.angular));
