(function () {
    'use strict';

    function MapController($state, $timeout, LocationService, LogService, HeaderService) {
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

        vm.travel = function (args) {
            LogService.addMessage("Traveling to " + args.location.name + "...");
            $state.go('location', { id: args.location._id });
        };
    }

    MapController.$inject = [
        '$state',
        '$timeout',
        'LocationService',
        'LogService',
        'HeaderService'
    ];

    angular.module('station')
        .controller('MapController', MapController);
}());
