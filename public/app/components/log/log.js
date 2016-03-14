(function (angular) {
    'use strict';

    function stLog() {
        return {
            restrict: 'AEC',
            templateUrl: '../public/app/components/log/log.html',
            controller: 'LogCtrl as logCtrl'
        };
    }

    function LogCtrl(LogService) {
        var vm;

        vm = this;

        vm.messages = LogService.getMessages();
    }

    LogCtrl.$inject = [
        'LogService'
    ];

    angular.module('station')
        .controller('LogCtrl', LogCtrl)
        .directive('stLog', stLog);

}(window.angular));