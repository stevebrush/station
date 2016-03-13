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

    InventoryCtrl.$inject = [
        'InventoryService'
    ];

    angular.module('station')
        .controller('InventoryCtrl', InventoryCtrl)
        .directive('stInventory', stInventory);

}(window, window.angular));