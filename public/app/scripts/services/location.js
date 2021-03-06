(function () {
    'use strict';

    function LocationService($http, $q) {
        var findLocationById,
            locations,
            that;

        that = this;
        locations = [];

        findLocationById = function (id) {
            var found;
            found = false;
            if (locations.length > 0) {
                locations.forEach(function (location) {
                    if (!found && location._id.$oid === id) {
                        found = location;
                    }
                });
            }
            return found;
        };

        this.getLocations = function () {
            return $http.get('/api/location').then(function (res) {
                locations = res.data.locations;
                return locations;
            });
        };

        this.getLocationById = function (id) {
            var deferred,
                found;

            deferred = $q.defer();
            found = findLocationById(id);

            if (found) {
                deferred.resolve(found);
            } else {
                $http.get('/api/location/' + id).then(function (res) {
                    locations.push(res.data.location);
                    deferred.resolve(res.data.location);
                });
            }
        
            return deferred.promise;
        };
    }

    LocationService.$inject = [
        '$http',
        '$q'
    ];

    angular.module('station')
        .service('LocationService', LocationService);
}());
