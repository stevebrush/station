(function (window, angular) {
    "use strict";

    function StructureService($http, $q) {
        var structures;

        structures = [];

        this.getStructureById = function (locationId, structureId) {
            var deferred,
                found;

            deferred = $q.defer();
            found = false;

            if (structures.length > 0) {
                structures.forEach(function (structure) {
                    if (structure._id === structureId) {
                        found = true;
                        deferred.resolve(structure);
                    }
                });
            }

            if (!found) {
                $http.get('/api/location/' + locationId + '/structure/' + structureId).then(function (res) {
                    structures.push(res.data.structure);
                    deferred.resolve(res.data.structure);
                });
            }

            return deferred.promise;
        };
    }

    StructureService.$inject = [
        '$http',
        '$q'
    ];

    angular.module('station')
        .service('StructureService', StructureService);

}(window, window.angular));