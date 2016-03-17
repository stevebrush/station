(function (window, angular) {
    "use strict";

    function Structure(Location) {
        function instance(options) {
            var callbacks,
                that;

            that = this;
            callbacks = [];

            that.location = new Location({
                locationId: options.locationId
            });

            that.location.ready(function (data) {
                that.location.getStructureById(options.structureId).then(function (data) {
                    that.model = data;
                    callbacks.forEach(function (callback) {
                        callback.call(that, that.model);
                    });
                });
            });

            that.ready = function (callback) {
                if (typeof callback === "function") {
                    callbacks.push(callback);
                }
            };
        }
        return instance;
    }

    Structure.$inject = [
        'Location'
    ];

    angular.module('station')
        .factory('Structure', Structure);

}(window, window.angular));