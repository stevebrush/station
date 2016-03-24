(function (angular) {
    'use strict';

    function stInventory() {
        return {
            restrict: 'E',
            bindToController: {
                'actions': '=',
                'items': '='
            },
            templateUrl: '../public/app/components/inventory/inventory.html',
            controller: 'InventoryController as inventoryCtrl'
        };
    }

    function InventoryController(BackpackService, LogService, utils) {
        var buttons,
            updateGroupValues,
            vm;

        vm = this;

        vm.destroyItem = function (index) {
            vm.items.splice(index, 1);
        };

        vm.selectItem = function (item) {
            item.isSelected = (item.isSelected) ? false : true;
        };

        vm.takeItem = function (index) {
            var item;
            item = vm.items[index];
            item.isSelected = false;
            BackpackService.addItem(item);
            LogService.addMessage(item.name + " added to backpack.");
            vm.destroyItem(index);
        };

        updateGroupValues = function () {
            vm.items.forEach(function (item) {
                item.groupValue = item.quantity * item.value;
            });
        };

        if (vm.actions) {
            buttons = [];
            vm.actions.forEach(function (action, i) {
                var k;
                for (k in action) {
                    buttons.push({
                        label: k,
                        method: vm[action[k]]
                    });
                }
            });
            vm.buttons = buttons;
        }

        updateGroupValues();
    }

    InventoryController.$inject = [
        'BackpackService',
        'LogService',
        'utils'
    ];

    angular.module('station')
        .directive('stInventory', stInventory)
        .controller('InventoryController', InventoryController);

}(window.angular));
