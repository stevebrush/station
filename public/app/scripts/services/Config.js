(function (angular) {
    'use strict';

    function ConfigService($q, $http) {
        var service;
        service = {};

        service.get = function (key) {
            var data,
                deferred;
            data = {};
            deferred = $q.defer();
            if (service.config) {
                data[key] = service.config[key];
                deferred.resolve(data);
            } else {
                $http.get('/api/config').then(function (res) {
                    service.config = res.data.config;
                    data[key] = service.config[key];
                    deferred.resolve(data);
                });
            }
            return deferred.promise;
        };

        service.getConfig = function () {
            var deferred;
            deferred = $q.defer();
            if (service.config) {
                deferred.resolve(service.config);
            } else {
                $http.get('/api/config').then(function (res) {
                    service.config = res.data.config;
                    deferred.resolve(service.config);
                });
            }
            return deferred.promise;
        };

        return service;
    }

    ConfigService.$inject = [
        '$q',
        '$http'
    ];

    angular.module('station')
        .service('ConfigService', ConfigService);

}(window.angular));
