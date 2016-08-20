(function (angular) {
    'use strict';

    function stMeterButton() {
        return {
            restrict: 'E',
            scope: true,
            bindToController: {
                action: '=',
                label: '=',
                max: '=',
                model: '=',
                alert: '='
            },
            templateUrl: '../public/app/components/meter-button/meter-button.html',
            controller: 'MeterButtonController as buttonCtrl',
            link: function (scope, element, attr, controller) {
                scope.$watchCollection(attr.model, function () {
                    controller.updateGauge();
                });
                scope.$watch(attr.alert, function (a) {
                    controller.showMessage(a);
                }, true);
            }
        };
    }

    function MeterButtonController($timeout) {
        var vm;
        vm = this;
        vm.meterWidth = 100;

        vm.updateGauge = function () {
            if (vm.model <= 0) {
                vm.meterWidth = 0;
            } else {
                vm.meterWidth = vm.model / vm.max * 100;
            }
        };

        vm.showMessage = function (message) {
            if (!message) {
                return;
            }
            vm.message = {
                text: message,
                isVisible: false
            };
            $timeout(function () {
                vm.message.isVisible = true;
                $timeout(function () {
                    vm.message.isVisible = false;
                    vm.alert = undefined; // Reset the scope
                }, 1000);
            }, 10);
        };

        vm.performAction = function () {
            if (!vm.isWaiting) {
                vm.isWaiting = true;
                vm.action.call({}).then(function () {
                    vm.isWaiting = false;
                });
            }
        };
    }

    MeterButtonController.$inject = [
        '$timeout'
    ];

    angular.module('station')
        .controller('MeterButtonController', MeterButtonController)
        .directive('stMeterButton', stMeterButton);

}(window.angular));
