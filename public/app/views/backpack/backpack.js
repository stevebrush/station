(function (angular) {
    'use strict';

    function BackpackController(CharacterService, HeaderService) {
        var player,
            vm;

        vm = this;
        vm.maxWeight = 50;
        vm.maxMoney = 99;

        CharacterService.getPlayer().then(function (data) {
            player = data;
            vm.backpack = player.backpack;
            vm.isReady = true;
        });

        HeaderService.set({
            title: 'Backpack',
            showBackButton: true
        });
    }

    BackpackController.$inject = [
        'CharacterService',
        'HeaderService'
    ];

    angular.module('station')
        .controller('BackpackController', BackpackController);

}(window.angular));
