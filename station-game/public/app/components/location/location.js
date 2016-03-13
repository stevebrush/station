(function () {
    'use strict';

    function LocationCtrl($state, LocationService) {
        var vm;

        vm = this;

        LocationService.getLocationById($state.params.id).then(function (data) {
            vm.location = data;
        });
    }

    LocationCtrl.$inject = [
        '$state',
        'LocationService'
    ];

    angular.module('station')
        .controller('LocationCtrl', LocationCtrl);
}());