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

    function EnemyController(CharacterService, LogService) {
        var vm;

        vm = this;
        vm.meterWidth = 100;

        CharacterService.getEnemy(vm.model).then(function (data) {
            vm.enemy = data;
            CharacterService.getPlayer().then(function (data) {
                vm.player = data;
                vm.enemy.startAttacking(data);
            });
        });

        vm.attackEnemy = function () {
            if (Math.random() > 0.5) {
                vm.enemy.getStatus().health -= 2;
                LogService.addMessage(vm.player.name + " attacks " + vm.enemy.name + ". [-2]");
                if (vm.enemy.getStatus().health <= 0) {
                    vm.meterWidth = 0;
                    vm.enemy.stopAttacking();
                    vm.enemy.backpack.name = vm.enemy.name + " Corpse";
                    vm.isDead = true;
                } else {
                    vm.meterWidth = (vm.enemy.getStatus().health / vm.enemy.getAttributes().vitality) * 100;
                }
            } else {
                LogService.addMessage(vm.player.name + " misses " + vm.enemy.name + ".");
            }
        };
    }

    EnemyController.$inject = [
        'CharacterService',
        'LogService'
    ];

    angular.module('station')
        .controller('EnemyController', EnemyController)
        .directive('stEnemy', stEnemy);

}(window.angular));
