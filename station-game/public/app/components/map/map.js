(function () {
    'use strict';

    function MapCtrl(LocationService) {
        var vm;

        vm = this;

        LocationService.getLocations().then(function (data) {
            vm.locations = data.locations;
        });
    }

    MapCtrl.$inject = [
        'LocationService'
    ];

    angular.module('station')
        .controller('MapCtrl', MapCtrl);
}());