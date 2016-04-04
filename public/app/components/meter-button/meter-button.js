(function (angular) {
    'use strict';

    function stMeterButton() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            bindToController: {
                action: '=',
                label: '=',
                max: '=',
                model: '='
            },
            templateUrl: '../public/app/components/meter-button/meter-button.html',
            controller: 'MeterButtonController as buttonCtrl',
            link: function (scope, element, attr, controller) {
                scope.$watchCollection(attr.model, function (a, b) {
                    controller.updateGauge();
                    element[0].className += " flash";
                    setTimeout(function () {
                        element[0].className = element[0].className.replace(' flash', '');
                    }, 500);
                });
            }
        };
    }

    function MeterButtonController($timeout) {
        var vm;
        vm = this;
        vm.meterTimerWidth = 0;
        vm.meterGaugeWidth = 100;
        vm.updateGauge = function () {
            if (vm.model <= 0) {
                vm.meterGaugeWidth = 0;
            } else {
                vm.meterGaugeWidth = vm.model / vm.max * 100;
            }
        };
        vm.performAction = function () {
            if (!vm.isWaiting) {
                vm.action.call({});
                vm.isWaiting = true;
                vm.meterTimerWidth = 100;

                $timeout(function () {
                    vm.isWaiting = false;
                    vm.meterTimerWidth = 0;
                }, 800);
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
