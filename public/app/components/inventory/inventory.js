(function (angular) {
    'use strict';

    function stInventory() {
        return {
            restrict: 'E',
            bindToController: {
                'actions': '=',
                'vessel': '='
            },
            templateUrl: '../public/app/components/inventory/inventory.html',
            controller: 'InventoryController as inventoryCtrl'
        };
    }

    function InventoryController(CharacterService, LogService, utils) {
        var buttons,
            player,
            vm;

        vm = this;

        CharacterService.getPlayer().then(function (data) {
            player = data;
            vm.isReady = true;
        });

        vm.destroyItem = function (index) {
            vm.vessel.removeItemByIndex(index);
        };

        vm.selectItem = function (item) {
            item.isSelected = (item.isSelected) ? false : true;
        };

        vm.takeItem = function (index) {
            player.backpack.addItem(vm.vessel.items[index]);
            vm.vessel.removeItemByIndex(index);
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
