(function (angular) {
    'use strict';

    function stIntervalButton() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            bindToController: {
                label: '@',
                numIterations: '@',
                onComplete: '=',
                options: '='
            },
            templateUrl: '../public/app/components/interval-button/interval-button.html',
            controller: 'IntervalButtonController as buttonCtrl',
            link: function (scope, element, attrs, controller) {}
        };
    }

    function IntervalButtonController($interval) {
        var vm;
        vm = this;

        if (!vm.numIterations || vm.numIterations === 0) {
            vm.numIterations = 1;
        }

        vm.start = function () {
            var i,
                stop;

            i = 0;

            stop = $interval(function () {
                var item;
                if (i < vm.numIterations) {
                    console.log("Waiting...");
                } else {
                    $interval.cancel(stop);
                    vm.onComplete.call({}, vm.options);
                }
                i++;
            }, 800);
        };
    }

    IntervalButtonController.$inject = [
        '$interval'
    ];

    angular.module('station')
        .controller('IntervalButtonController', IntervalButtonController)
        .directive('stIntervalButton', stIntervalButton);

}(window.angular));
