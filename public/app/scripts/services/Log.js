(function (angular) {
    'use strict';

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

    angular.module('station')
        .service('LogService', LogService);

}(window.angular));