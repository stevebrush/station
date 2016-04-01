(function (angular) {
    'use strict';

    function stEnemyButton() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            bindToController: {
                enemy: '='
            },
            templateUrl: '../public/app/components/enemy-button/enemy-button.html',
            controller: 'EnemyButtonController as buttonCtrl'
        };
    }

    function EnemyButtonController(CharacterService) {
        var vm;

        vm = this;
        vm.meterWidth = 100;

        CharacterService.getEnemy(vm.enemy).then(function (data) {
            //???
        });

        vm.attack = function () {
            console.log("Attack!");

            vm.enemy.status.health -= 2;

            if (vm.enemy.status.health <= 0) {
                console.log("Enemy Dead!");
                vm.meterWidth = 0;
            } else {
                vm.meterWidth = (vm.enemy.status.health / vm.enemy.attributes.vitality) * 100;
            }
        };
    }

    EnemyButtonController.$inject = [
        'CharacterService'
    ];

    angular.module('station')
        .controller('EnemyButtonController', EnemyButtonController)
        .directive('stEnemyButton', stEnemyButton);

}(window.angular));
