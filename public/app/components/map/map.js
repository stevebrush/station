(function () {
    'use strict';

    function MapCtrl(LocationService, HeaderService) {
        var vm;

        vm = this;

        if (!vm.locations) {
            LocationService.getLocations().then(function (data) {
                vm.locations = data;
                HeaderService.set({
                    title: "Map"
                });
            });
        }

        vm.selectLocation = function (location) {
            location.isSelected = (location.isSelected === true) ? false : true;
        };
    }

    MapCtrl.$inject = [
        'LocationService',
        'HeaderService'
    ];

    angular.module('station')
        .controller('MapCtrl', MapCtrl);
}());
