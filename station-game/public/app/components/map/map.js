(function () {
    'use strict';

    function MapCtrl(LocationService) {
        var vm;

        vm = this;

        if (!vm.locations) {
            LocationService.getLocations().then(function (data) {
                vm.locations = data;
            });
        }
    }

    MapCtrl.$inject = [
        'LocationService'
    ];

    angular.module('station')
        .controller('MapCtrl', MapCtrl);
}());