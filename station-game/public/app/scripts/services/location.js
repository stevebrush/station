(function () {
    'use strict';

    function LocationService($http, $q) {
        var locations;

        locations = [];

        this.getLocations = function () {
            var deferred;

            deferred = $q.defer();

            if (locations.length) {
                deferred.resolve(locations);
            } else {
                $http.get('/api/location').then(function (res) {
                    locations = res.data.locations;
                    deferred.resolve(locations);
                });
            }

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

    LocationService.$inject = [
        '$http',
        '$q'
    ];

    angular.module('station')
        .service('LocationService', LocationService);
}());