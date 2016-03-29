(function (angular) {
    'use strict';

    function fetchData() {
        var $http = angular.injector(["ng"]).get("$http");
        return $http.get('/api/config', { cache: true }).then(function (res) {
            angular.module('station').constant("STATION_CONFIG", res.data.config);
        });
    }

    function bootstrapApplication() {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ["station"]);
        });
    }

    function ConfigRoutes($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '../public/app/views/home/home.html',
                controller: 'HomeController as homeCtrl'
            })
            .state('map', {
                url: '/map',
                templateUrl: '../public/app/views/map/map.html',
                controller: 'MapController as mapCtrl'
            })
            .state('location', {
                url: '/location/:id',
                templateUrl: '../public/app/views/location/location.html',
                controller: 'LocationController as locationCtrl'
            })
            .state('structure', {
                url: '/location/:locationId/structure/:structureId/room/:roomId',
                templateUrl: '../public/app/views/structure/structure.html',
                controller: 'StructureController as structureCtrl'
            })
            .state('backpack', {
                url: '/backpack',
                templateUrl: '../public/app/views/backpack/backpack.html',
                controller: 'BackpackController as backpackCtrl'
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

    fetchData().then(bootstrapApplication);

}(window.angular));
