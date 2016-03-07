(function (window, angular) {
    "use strict";

    function StorageService() {
        var securred;

        securred = {};

        this.secure = function (data) {
            // Stores stuff locally, but not eternally.
            //console.log("Securing " + data.storageKey, data);
        };
        this.save = function () {
            // Takes the locally "secured" stuff, and saves it eternally.
        };
    }

    angular.module('station')
        .service('StorageService', StorageService);

}(window, window.angular));