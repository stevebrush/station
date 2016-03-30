(function (angular) {
    'use strict';

    function stIntervalButton() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            bindToController: {
                label: '@',
                labelRunning: '@',
                numIterations: '@',
                onComplete: '=',
                options: '='
            },
            templateUrl: '../public/app/components/interval-button/interval-button.html',
            controller: 'IntervalButtonController as buttonCtrl'
        };
    }

    function IntervalButtonController($interval, $rootScope) {
        var iterationDuration,
            vm;

        vm = this;
        vm.meterWidth = 0;
        iterationDuration = 300;

        if (!vm.numIterations || vm.numIterations === 0) {
            vm.numIterations = 1;
        }

        vm.start = function () {
            var i,
                iterations,
                stop;

            i = 1;
            iterations = parseInt(vm.numIterations) + 1;
            vm.label = vm.labelRunning;

            $rootScope.$broadcast('disable:all');

            stop = $interval(function () {
                var item;
                if (i === iterations) {
                    $interval.cancel(stop);
                    $rootScope.$broadcast('enable:all');
                    vm.onComplete.call({}, vm.options);
                } else {
                    vm.meterWidth = Math.ceil((i / (iterations - 1)) * 100);
                }
                i++;
            }, iterationDuration);
        };
    }

    IntervalButtonController.$inject = [
        '$interval',
        '$rootScope'
    ];

    angular.module('station')
        .controller('IntervalButtonController', IntervalButtonController)
        .directive('stIntervalButton', stIntervalButton);

}(window.angular));
