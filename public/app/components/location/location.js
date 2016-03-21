(function () {
    'use strict';

    function LocationCtrl($state, LocationService, HeaderService) {
        var vm;

        vm = this;

        LocationService.getLocationById($state.params.id).then(function (data) {
            vm.location = data;
            HeaderService.set({
                showBackButton: true,
                backButtonTitle: "Map",
                backButtonCallback: function () {
                    $state.go("map");
                },
                title: vm.location.name
            });
        });

        vm.selectStructure = function (structure) {
            structure.isSelected = (structure.isSelected === true) ? false : true;
        };
    }

    LocationCtrl.$inject = [
        '$state',
        'LocationService',
        'HeaderService'
    ];

    angular.module('station')
        .controller('LocationCtrl', LocationCtrl);
}());
