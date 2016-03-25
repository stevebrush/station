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

    function VesselController(BackpackService, LogService, utils) {
        var vm;
        vm = this;
        vm.isOpen = false;

        vm.open = function () {
            vm.isOpen = (vm.isOpen) ? false : true;
            vm.owner.items.forEach(function (item) {
                item.parent = vm.owner;
            });
        };

        vm.takeAllItems = function () {
            vm.owner.items.forEach(function (item, i) {
                item.isSelected = false;
                LogService.addMessage(item.name + " added to inventory.");
                BackpackService.addItem(item);
                delete vm.owner.items[i];
            });
            utils.cleanArray(vm.owner.items);
            if (vm.owner.items.length === 0) {
                vm.open();
            }
        };
    }

    VesselController.$inject = [
        'BackpackService',
        'LogService',
        'utils'
    ];

    angular.module('station')
        .controller('VesselController', VesselController)
        .directive('stVessel', stVessel);

}(window.angular));
