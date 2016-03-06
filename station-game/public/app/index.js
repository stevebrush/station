(function (angular) {
    'use strict';

    function ConfigRoutes($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '../public/app/views/home/home.html',
                controller: 'HomeCtrl as homeCtrl'
            })
            .state('map', {
                url: '/map',
                templateUrl: '../public/app/components/map/map.html',
                controller: 'MapCtrl as mapCtrl'
            })
            .state('location', {
                url: '/location/:id',
                templateUrl: '../public/app/components/location/location.html',
                controller: 'LocationCtrl as locationCtrl'
            })
            .state('structure', {
                url: '/location/:locationId/structure/:structureId',
                templateUrl: '../public/app/components/structure/structure.html',
                controller: 'StructureCtrl as structureCtrl'
            });
    }

    ConfigRoutes.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    angular.module('station', [
        'ui.router',
        'station.templates'
    ]).config(ConfigRoutes);

}(window.angular));