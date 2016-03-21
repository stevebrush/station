(function (window, angular) {
    "use strict";

    function StructureService($q, Location) {
        var locationId,
            service,
            structure;

        service = {};

        service.setLocationId = function (id) {
            locationId = id;
            return service;
        };

        service.getStructureById = function (id) {
            var deferred,
                location,
                structure;

            deferred = $q.defer();

            if (service.structure && service.structure._id === id) {
                deferred.resolve(service.structure);
            } else {
                console.log("Fetching new structure data...");
                location = new Location({
                    locationId: locationId
                });
                location.ready(function (data) {
                    location.getStructureById(id).then(function (data) {
                        service.structure = data;
                        deferred.resolve(data);
                    });
                });
            }

            return deferred.promise;
        };

        return service;
    }

    StructureService.$inject = [
        '$q',
        'Location'
    ];

    angular.module('station')
        .service('StructureService', StructureService);

}(window, window.angular));