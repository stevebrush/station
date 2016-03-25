(function (angular) {
    'use strict';

    function BackpackController($scope, BackpackService, HeaderService) {
        var vm;

        vm = this;
        vm.items = BackpackService.getItems();
        vm.maxWeight = 50;
        vm.maxMoney = 99;

        HeaderService.set({
            title: 'Backpack',
            showBackButton: true
        });

        BackpackService.getMoneyTotal().then(function (data) {
            vm.money = data.moneyTotal;
        });

        BackpackService.getWeightTotal().then(function (data) {
            vm.weight = data.weightTotal;
        });
    }

    BackpackController.$inject = [
        '$scope',
        'BackpackService',
        'HeaderService'
    ];

    angular.module('station')
        .controller('BackpackController', BackpackController);

}(window.angular));
