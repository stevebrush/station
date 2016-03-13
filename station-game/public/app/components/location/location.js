(function () {
    'use strict';

    function LocationCtrl($state, LocationService) {
        var vm;

        vm = this;

        LocationService.getLocationById($state.params.id).then(function (data) {
            vm.location = data;
        });

        vm.selectStructure = function (structure) {
            structure.isSelected = (structure.isSelected === true) ? false : true;
        };
    }

    LocationCtrl.$inject = [
        '$state',
        'LocationService'
    ];

    angular.module('station')
        .controller('LocationCtrl', LocationCtrl);
}());