(function (angular) {
    'use strict';

    function LogService() {
        var maxNumMessages,
            messages;

        maxNumMessages = 15;
        messages = [];

        this.addMessage = function (message) {
            messages.unshift({
                text: message
            });
            messages.splice(maxNumMessages, messages.length - maxNumMessages);
        };

        this.getMessages = function () {
            return messages;
        };
    }

    angular.module('station')
        .service('LogService', LogService);

}(window.angular));
