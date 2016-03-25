(function () {
    'use strict';

    function DataService($http, $q) {
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

        that.getLocations = function () {
            return $http.get('/data/locations.json').then(function (res) {
                locations = res.data;
                return locations;
            });
        };

        that.getLocationById = function (id) {
            var deferred,
                found;

            deferred = $q.defer();
            found = findLocationById(id);

            if (found) {
                deferred.resolve(found);
            } else {
                that.getLocations().then(function (res) {
                    found = findLocationById(id);
                    deferred.resolve(found);
                });
            }

            return deferred.promise;
        };
    }

    DataService.$inject = [
        '$http',
        '$q'
    ];

    angular.module('station')
        .service('DataService', DataService);
}());
