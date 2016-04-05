(function (angular) {
    'use strict';

    function stEnemy() {
        return {
            restrict: 'E',
            scope: true,
            bindToController: {
                model: '='
            },
            templateUrl: '../public/app/components/enemy/enemy.html',
            controller: 'EnemyController as enemyCtrl'
        };
    }

    function EnemyController(CharacterService) {
        var vm;
        vm = this;

        CharacterService.getEnemy(vm.model).then(function (data) {
            vm.enemy = data;
            CharacterService.getPlayer().then(function (data) {
                vm.player = data;
                if (!vm.enemy.isDead) {
                    vm.health = vm.enemy.getStatus('health');
                    vm.vitality = vm.enemy.getAttribute('vitality');
                    vm.enemy.startAttacking(vm.player);
                }
                vm.isReady = true;
            });
        });

        vm.attackEnemy = function () {
            vm.health = vm.player.attack(vm.enemy);
        };
    }

    EnemyController.$inject = [
        'CharacterService'
    ];

    angular.module('station')
        .controller('EnemyController', EnemyController)
        .directive('stEnemy', stEnemy);

}(window.angular));
