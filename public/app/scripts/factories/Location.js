(function () {
    'use strict';

    function Location($q, LocationService) {
        var Instance;

        Instance = function (options) {
            var callbacks,
                that;

            that = this;
            callbacks = [];

            LocationService.getLocationById(options.locationId).then(function (data) {
                that.model = data;
                callbacks.forEach(function (callback) {
                    callback.call(that, that.model);
                });
            });

            that.getStructureById = function (structureId) {
                var deferred;

                deferred = $q.defer();

                that.model.structures.forEach(function (structure) {
                    if (structure._id === structureId) {
                        deferred.resolve(structure);
                    }
                });

                return deferred.promise;
            };

            that.ready = function (callback) {
                if (typeof callback === "function") {
                    callbacks.push(callback);
                }
            };
        };

        return Instance;
    }

    Location.$inject = [
        '$q',
        'LocationService'
    ];

    angular.module('station')
        .factory('Location', Location);
}());
