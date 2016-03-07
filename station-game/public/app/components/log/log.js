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

    function LogService() {
        var messages;

        messages = [];

        this.addMessage = function (message) {
            messages.unshift({
                text: message
            });
        };

        this.getMessages = function () {
            return messages;
        };
    }

    LogCtrl.$inject = [
        'LogService'
    ];

    angular.module('station')
        .controller('LogCtrl', LogCtrl)
        .directive('stLog', stLog)
        .service('LogService', LogService);

}(window.angular));