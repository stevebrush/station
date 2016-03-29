(function (angular) {
    'use strict';

    function stInventory() {
        return {
            restrict: 'E',
            bindToController: {
                'actions': '=',
                'owner': '=',
                'visitor': '='
            },
            templateUrl: '../public/app/components/inventory/inventory.html',
            controller: 'InventoryController as inventoryCtrl'
        };
    }

    function InventoryController(CharacterService, LogService, utils) {
        var vm;
        vm = this;

        vm.destroyItem = function (index) {
            var item;
            item = vm.owner.items[index];
            if (item.isDroppable === true) {
                vm.owner.removeItemByIndex(index);
            } else {
                LogService.addMessage(item.name + " cannot be destroyed.");
            }
        };

        vm.selectItem = function (item) {
            item.isSelected = (item.isSelected) ? false : true;
        };

        vm.moveItem = function (index) {
            vm.visitor.addItem(vm.owner.items[index]);
            vm.owner.removeItemByIndex(index);
        };
    }

    InventoryController.$inject = [
        'CharacterService',
        'LogService',
        'utils'
    ];

    angular.module('station')
        .directive('stInventory', stInventory)
        .controller('InventoryController', InventoryController);

}(window.angular));
