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
                url: '/location/:locationId/structure/:structureId/room/:roomId',
                templateUrl: '../public/app/components/structure/structure.html',
                controller: 'StructureCtrl as structureCtrl'
            })
            .state('inventory', {
                url: '/inventory',
                templateUrl: '../public/app/components/inventory/inventory.html',
                controller: 'InventoryCtrl as inventoryCtrl'
            });
    }

    function Run($rootScope, $location, $state) {
        $rootScope.state = {};
        $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
            $rootScope.state.back = function () {
                if (from.name) {
                    $state.go(from.name, fromParams);
                } else {
                    $state.go('map');
                }
            };
        });
    }

    ConfigRoutes.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    Run.$injext = [
        '$rootScope',
        '$location',
        '$state'
    ];

    angular.module('station', [
        'ui.router',
        'station.templates'
    ])
        .config(ConfigRoutes)
        .run(Run);

}(window.angular));