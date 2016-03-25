(function () {
    'use strict';

    function MapController(LocationService, HeaderService) {
        var vm;

        vm = this;

        LocationService.getLocations().then(function (data) {
            vm.locations = data;
            HeaderService.set({
                title: "Map"
            });
        });

        vm.selectLocation = function (location) {
            location.isSelected = (location.isSelected === true) ? false : true;
        };
    }

    MapController.$inject = [
        'LocationService',
        'HeaderService'
    ];

    angular.module('station')
        .controller('MapController', MapController);
}());
