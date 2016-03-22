(function (angular) {
    'use strict';

    function stInventory() {
        return {
            restrict: 'AEC',
            templateUrl: '../public/app/components/inventory/inventory.html',
            controller: 'InventoryCtrl as inventoryCtrl'
        };
    }

    function InventoryCtrl(InventoryService, HeaderService) {
        var vm;

        vm = this;

        HeaderService.set({
            title: 'Inventory',
            showBackButton: true
        });

        vm.items = InventoryService.getItems();

        InventoryService.getMoneyTotal().then(function (data) {
            vm.money = data.moneyTotal;
        });
    }

    InventoryCtrl.$inject = [
        'InventoryService',
        'HeaderService'
    ];

    angular.module('station')
        .controller('InventoryCtrl', InventoryCtrl)
        .directive('stInventory', stInventory);

}(window.angular));
