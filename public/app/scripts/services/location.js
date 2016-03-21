(function () {
    'use strict';

    function Location($q, LocationService) {
        function instance(options) {
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
        }
        return instance;
    }

    function LocationService($http, $q) {
        var locations;

        locations = [];

        this.getLocations = function () {
            var deferred;

            deferred = $q.defer();

            $http.get('/api/location').then(function (res) {
                locations = res.data.locations;
                deferred.resolve(locations);
            });

            return deferred.promise;
        };

        this.getLocationById = function (id) {
            var deferred,
                found;

            deferred = $q.defer();
            found = false;

            if (locations.length > 0) {
                locations.forEach(function (location) {
                    if (location._id === id) {
                        found = true;
                        deferred.resolve(location);
                    }
                });
            }

            if (!found) {
                $http.get('/api/location/' + id).then(function (res) {
                    locations.push(res.data.location);
                    deferred.resolve(res.data.location);
                });
            }

            return deferred.promise;
        }
    }

    Location.$inject = [
        '$q',
        'LocationService'
    ];

    LocationService.$inject = [
        '$http',
        '$q'
    ];

    angular.module('station')
        .factory('Location', Location)
        .service('LocationService', LocationService);
}());
