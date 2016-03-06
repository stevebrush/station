(function () {
    'use strict';

    function LocationService($http) {
        this.getLocations = function () {
            return $http.get('/api/location').then(function (res) {
                return res.data;
            });
        };
        this.getLocationById = function (id) {
            return $http.get('/api/location/' + id).then(function (res) {
                return res.data;
            });
        }
    }

    LocationService.$inject = [
        '$http'
    ];

    angular.module('station')
        .service('LocationService', LocationService);
}());