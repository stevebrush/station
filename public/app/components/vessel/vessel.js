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
        vm.itemActions = [{ Take: 'moveItem' }];
        vm.isOpen = false;

        CharacterService.getPlayer().then(function (data) {
            console.log("Player gotten!");
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
                vm.itemActions = [{ Take: 'moveItem' }];
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
            var i,
                stop;
            i = 0;
            stop = $interval(function () {
                var item;
                if (i < vm.owner.items.length) {
                    item = vm.owner.items[i];
                    vm.owner.removeItemByIndex(i);
                    vm.visitor.addItem(item);
                } else {
                    $interval.cancel(stop);
                    vm.open();
                }
                i++;
            }, 300);

            //vm.visitor.addItems(vm.owner.removeAllItems());
            //vm.open();
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
