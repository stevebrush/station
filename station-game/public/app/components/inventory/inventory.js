(function (window, angular) {
    "use strict";

    function stInventory() {
        return {
            restrict: 'AEC',
            templateUrl: '../public/app/components/inventory/inventory.html',
            controller: 'InventoryCtrl as inventoryCtrl'
        };
    }

    function InventoryCtrl(InventoryService) {
        var vm;

        vm = this;

        vm.items = InventoryService.getItems();
    }

    function InventoryService() {
        var items;

        items = [];

        this.addItem = function (item) {
            items.push(item);
        };

        this.getItems = function () {
            return items;
        };

        this.getItemById = function (id) {
            var i,
                len;
            id = id.toString();
            len = items.length;
            for (i = 0; i < len; ++i) {
                if (items[i]._id === id) {
                    return items[i];
                }
            }
        };

        this.removeItemById = function (id) {
            var i,
                index,
                len;
            index = -1;
            id = id.toString();
            len = items.length;
            for (i = 0; i < len; ++i) {
                if (items[i]._id === id) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                items.splice(index, 1);
            }
        };
    }

    InventoryCtrl.$inject = [
        'InventoryService'
    ];

    angular.module('station')
        .controller('InventoryCtrl', InventoryCtrl)
        .directive('stInventory', stInventory)
        .service('InventoryService', InventoryService);

}(window, window.angular));