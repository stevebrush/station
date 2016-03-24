(function (angular) {
    'use strict';

    function stLog() {
        return {
            restrict: 'AEC',
            replace: true,
            templateUrl: '../public/app/components/log/log.html',
            controller: 'LogController as logCtrl',
            link: function (scope, element, attrs, controller) {
                // Flash the log when there's a new message.
                scope.$watch(function () {
                    return controller.messages[0];
                }, function (newValue, oldValue) {
                    element[0].className = "flash";
                    setTimeout(function () {
                        element[0].className = "";
                    }, 1000);
                });
            }
        };
    }

    function LogController(LogService) {
        var vm;

        vm = this;

        vm.messages = LogService.getMessages();
    }

    LogController.$inject = [
        'LogService'
    ];

    angular.module('station')
        .controller('LogController', LogController)
        .directive('stLog', stLog);

}(window.angular));
