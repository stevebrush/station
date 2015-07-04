(function (angular, console) { "use strict";


    console.log("Hello, World!");


    var app = angular.module('Station', ['ngTouch', 'ngRoute']);



    app.run(['$rootScope', '$location',
        function ($rootScope, $location) {
            var history = [];
            $rootScope.$on('$routeChangeSuccess', function() {
                history.push($location.$$path);
            });
            $rootScope.back = function () {
                var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
                $location.path(prevUrl);
            };
        }]);


    /**
     * Routes.
     */
    app.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
            .when('/home', {
                templateUrl: 'app/views/home.html'
            })
            .when('/map', {
                templateUrl: 'app/views/map.html',
                controller: "MapCtrl"
            })
            .when('/region/:id', {
                templateUrl: 'app/views/region.html',
                controller: 'RegionCtrl'
            })
            .when('/location/:id', {
                templateUrl: 'app/views/location.html',
                controller: 'LocationCtrl'
            })
            .when('/trader/:id', {
                templateUrl: 'app/views/trader.html',
                controller: "TraderCtrl"
            })
            .when('/pack', {
                templateUrl: 'app/views/pack.html',
                controller: ['$scope', 'playerService', function ($scope, playerService) {
                    playerService.getInventory().then(function (data) {
                        $scope.player = data;
                    });
                }]
            })
            .when('/vessel', {
                templateUrl: 'app/views/vessel.html',
                controller: ['$scope', 'playerService', 'vesselService', function ($scope, playerService, vesselService) {
                    var vesselId = 0;
                    playerService.getInventory().then(function (data) {
                        $scope.player = data;
                    });
                    vesselService.getInventory(vesselId).then(function (data) {
                        $scope.vessel = data;
                    });
                }]
            })
            .when('/pickpocket/:id', {
                templateUrl: 'app/views/pickpocket.html',
                controller: "PickpocketCtrl"
            })
            .otherwise({
                redirectTo: '/home'
            });
        }]);



    /**
     * Services.
     */


    app.factory('Lawnchair', function () {
        return window.Lawnchair;
    });



    /*
    app.factory('Resource', ['$http', '$q',
        function ($http, $q) {

            // Resource Class.
            function Resource(options) {

                var _cache = null;
                var _deferred = $q.defer();

                function load(index) {
                    $http.get(options.path)
                        .success(function (res) {
                            _cache = res;
                            send(index);
                        })
                        .error(function () {
                            _deferred.reject();
                        });
                }

                function resolve(data) {
                    _deferred.resolve(data);
                }

                function send(index) {
                    if (typeof _cache[index] !== "undefined") {
                        resolve(_cache[index]);
                    } else {
                        resolve(_cache);
                    }
                }

                function find(id) {
                    if (_cache === null) {
                        load(id);
                    } else {
                        _deferred = $q.defer();
                        send(id);
                    }
                    return _deferred.promise;
                }

                function promise() {
                    return _deferred.promise;
                }

                function cache(obj) {
                    if (typeof obj !== 'object') {
                        return _cache;
                    }
                    _cache = obj;
                }

                return {
                    cache: cache,
                    send: send,
                    load: load,
                    promise: promise,
                    find: find,
                    resolve: resolve,
                    defer: function () {
                        _deferred = $q.defer();
                    },
                    deferred: _deferred
                };
            }

            return {
                getInstance: function (options) {
                    return new Resource(options);
                }
            };

        }]);
    */


    app.factory('Resource', ['$http', '$q', 'Lawnchair',
        function ($http, $q, Lawnchair) {

            var _storage = new Lawnchair({ name: "Station" });

            _storage.nuke();

            function Resource(options) {

                var _cache = {};

                function search(id) {

                    var deferred = $q.defer();

                    _storage.get(options.key, function (saved) {

                        saved = saved || {};
                        saved.records = saved.records || {};

                        if (typeof saved.records[id] !== "undefined") {
                            console.log("Storage found! Let's use that...");
                            deferred.resolve(saved.records[id]);

                        } else {

                            find1(id).then(function (data) {
                                saved.records[id] = data[options.key];
                                _storage.save({
                                    key: options.key,
                                    records: saved.records
                                });
                                _cache = saved.records;
                                deferred.resolve(saved.records[id]);
                            });

                        }
                    });
                    return deferred.promise;
                }

                function find1(id) {
                    var deferred = $q.defer();
                    $http
                        .get(options.endpoint.one + id)
                        .success(function (data) {
                            deferred.resolve(data);
                        })
                        .error(function (data) {
                            deferred.resolve(data);
                        });
                    return deferred.promise;
                }

                function findAll() {
                    var deferred = $q.defer();
                    $http
                        .get(options.endpoint.all)
                        .success(function (data) {
                            deferred.resolve(data);
                        })
                        .error(function (data) {
                            deferred.resolve(data);
                        });
                    return deferred.promise;
                }

                function searchAll() {
                    var deferred = $q.defer();

                    _storage.get(options.key, function (saved) {
                        saved = saved || {};
                        if (saved.allCached === true && saved.records) {
                            console.log("All items have been searched already!");
                            deferred.resolve(saved.records);

                        } else {
                            findAll().then(function (data) {
                                _storage.save({
                                    key: options.key,
                                    records: data[options.key],
                                    allCached: true
                                });
                                _cache = data[options.key];
                                deferred.resolve(_cache);
                            });
                        }
                    });
                    return deferred.promise;
                }

                return {
                    find: search,
                    findAll: searchAll,
                    cache: function () {
                        return _cache;
                    }
                };
            }

            return {
                getInstance: function (options) {
                    return new Resource(options);
                },
                storage: function () {
                    return _storage;
                }
            };

        }]);



    app.factory('inventoryService', ['Resource',
        function (Resource) {

            var resource = new Resource.getInstance({
                key: 'Items',
                endpoint: {
                    all: 'api/items'
                }
            }), service = {};

            service.search = function (itemId) {
                var items = resource.cache();
                for (var i in items) {
                    if (parseInt(items[i].itemId) === itemId) {
                        return items[i];
                    }
                }
                return false;
            };

            service.sort = function () {
                var items = resource.cache().items;
                items.sort(function (a, b) {
                    var label1 = a.label.toUpperCase();
                    var label2 = b.label.toUpperCase();
                    return (label1 < label2) ? -1 : (label1 > label2) ? 1 : 0;
                });
            };

            service.merge = function (items) {
                var parentItem;
                var item;
                var temp = [];
                for (var k in items) {
                    item = items[k];
                    parentItem = service.search(item.itemId);
                    if (parentItem) {
                        temp[k] = item;
                        for (var prop in parentItem) {
                            temp[k][prop] = parentItem[prop];
                        }
                    }
                }
                return temp;
            };

            service.findAll = resource.findAll;

            return service;

        }]);



    app.factory('playerService', ['inventoryService', 'Resource', '$q',
        function (inventoryService, Resource, $q) {

            var resource = Resource.getInstance({
                key: 'Player',
                endpoint: {
                    all: 'models/player.json'
                }
            }), service = {};

            service.getPlayer = function () {
                var deferred = $q.defer();
                inventoryService.findAll().then(function () {
                    resource.findAll().then(function (data) {
                        data.items = inventoryService.merge(data.items);
                        deferred.resolve(data);
                    });
                });
                return deferred.promise;
            };

            return service;

        }]);



    app.factory('npcService', ['inventoryService', 'Resource',
        function (inventoryService, Resource) {

            var resource = Resource.getInstance({
                key: 'NPC',
                endpoint: {
                    one: 'api/npc/'
                }
            }), service = {};

            service.find = resource.find;

            return service;

        }]);



    app.factory('vesselService', ['Resource',
        function (Resource) {
            return Resource.getInstance({
                key: 'Vessel',
                endpoint: {
                    one: 'api/vessel/'
                }
            });
        }]);



    app.factory('regionService', ['Resource',
        function (Resource) {
            return Resource.getInstance({
                key: 'Region',
                endpoint: {
                    all: 'api/regions',
                    one: 'api/region/'
                }
            });
        }]);



    app.factory('locationService', ['Resource',
        function (Resource) {
            return Resource.getInstance({
                key: 'Location',
                endpoint: {
                    one: 'api/location/'
                }
            });
        }]);



    /**
     * Directives.
     */
    app.directive('stInventory',
        function () {
            return {
                templateUrl: 'app/partials/inventory.html',
                restrict: 'E',
                replace: true,
                scope: true,
                bindToController: {
                    owner: '=',
                    action: '=',
                    showMoney: '=',
                    isOverage: '='
                },
                controller: "InventoryCtrl as inventory"
            };
        });



    app.directive('stVessel',
        function () {
            return {
                templateUrl: 'app/partials/vessel.html',
                restrict: 'E',
                replace: true,
                scope: true,
                bindToController: {
                    vesselId: '=',
                    action: '='
                },
                controller: "VesselCtrl as vessel"
            };
        });



    /**
     * Controllers.
     */
    app.controller('TraderCtrl', ['$scope', '$routeParams', 'playerService', 'npcService', '$sce', '$rootScope',
        function ($scope, $routeParams, playerService, npcService, $sce, $rootScope) {

            var playerReady = false;
            var traderReady = false;
            var undo = {
                player: null,
                trader: null
            };

            function checkReady() {
                if (playerReady && traderReady) {
                    calculateItemValues();
                    $scope.isReady = true;
                }
            }

            function removeFromCart(item, owner) {
                var cart = owner.items;
                var clone = angular.copy(item);
                var deleteItem = function (item) {
                    for (var i in cart) {
                        if (cart[i].itemId === item.itemId) {
                            delete cart[i];
                            break;
                        }
                    }
                };
                if (item.quantity === 1) {
                    deleteItem(item);
                } else {
                    if (item.quantityRequested) {
                        item.quantity -= item.quantityRequested;
                        clone.quantity = item.quantityRequested;
                    } else {
                        item.quantity--;
                        clone.quantity = 1;
                    }
                    if (item.quantity < 1) {
                        deleteItem(item);
                    }
                }
                return clone;
            }

            function addToCart(item, owner) {
                var itemFound = false;
                var cart = owner.items;
                if (item.inCart === true) {
                    item.inCart = false;
                } else {
                    item.inCart = true;
                }
                for (var k in cart) {
                    if (typeof cart[k].inCart === "undefined") {
                        cart[k].inCart = false;
                    }
                    if (cart[k].inCart === item.inCart && cart[k].itemId === item.itemId) {
                        cart[k].quantity += item.quantityRequested;
                        itemFound = true;
                        break;
                    }
                }
                if (!itemFound) {
                    cart.push(item);
                    sortCart(owner);
                }
                calculateDifference();
            }

            function calculateDifference() {

                var sellTotal = 0;
                var buyTotal = 0;
                var i;
                var items;

                // Total sell.
                items = $scope.trader.items;
                for (i in items) {
                    if (items[i].inCart) {
                        sellTotal += items[i].value * items[i].quantity;
                    }
                }

                // Total buy.
                items = $scope.player.items;
                for (i in items) {
                    if (items[i].inCart) {
                        buyTotal += items[i].value * items[i].quantity;
                    }
                }

                $scope.totals.difference = sellTotal - buyTotal;
                $scope.totals.display = calculateDisplayTotal($scope.totals.difference);
                $scope.isDisabled = ($scope.totals.difference < 0 && $scope.isOverage);
            }

            function calculateDisplayTotal(net) {

                if (net === 0) {
                    $scope.isOverage = false;
                    $scope.totals.label = "--";
                    return "0";
                }

                // Player is taking a loss.
                if (net < 0) {
                    if (($scope.player.money * -1) > net) {
                        $scope.isOverage = true;
                        $scope.totals.label = "Loss";
                        return net;
                    }
                }

                // Player is earning money.
                if ($scope.trader.money < net) {
                    $scope.isOverage = true;
                    net = $scope.trader.money;
                    $scope.totals.label = "Profit";
                    return "+" + $scope.trader.money;
                }

                // Make sure the display total is positive.
                $scope.isOverage = false;
                $scope.totals.label = "Profit";
                return "+" + net;

            }

            function calculateItemValues() {

                var playerMultiplier = 0.5;
                var traderMultiplier = 0.6;

                var item;

                for (var p in $scope.player.items) {
                    item = $scope.player.items[p];
                    item.value = Math.round(parseInt(item.baseValue) - (parseInt(item.baseValue) * playerMultiplier));
                }

                for (var t in $scope.trader.items) {
                    item = $scope.trader.items[t];
                    item.value = Math.round(parseInt(item.baseValue) * (1 + traderMultiplier));
                }
            }

            function sortCart(owner) {
                var temp = [];
                for (var k in owner.items) {
                    if (owner.items[k].inCart) {
                        temp.unshift(owner.items[k]);
                    } else {
                        temp.push(owner.items[k]);
                    }
                }
                owner.items = temp;
            }

            // Various.
            $scope.player = {};
            $scope.trader = {};
            $scope.npcId = $routeParams.id;
            $scope.isReady = false;
            $scope.totals = {
                difference: 0,
                display: "0",
                label: "--"
            };
            $scope.isDisabled = true;

            // Retrieve player and trader inventories.
            playerService.getPlayer().then(function (data) {
                console.log("playerService: ", data);
                undo.player = angular.copy(data.items);
                $scope.player = data;
                playerReady = true;
                checkReady();
            });

            npcService.find($scope.npcId).then(function (data) {
                console.log("npcService: ", data);
                undo.trader = angular.copy(data.items);
                $scope.trader = data;
                traderReady = true;
                checkReady();
            });

            // Actions.
            $scope.buy = {
                label: $sce.trustAsHtml("Take"),
                onPreview: function (item) {
                    this.label = (item.inCart) ? $sce.trustAsHtml('<span class="fa fa-arrow-up"></span>Take Back') : $sce.trustAsHtml('<span class="fa fa-arrow-up"></span>Take');
                },
                onAccept: function (item) {
                    item.owner = 'npc';
                    var clone = removeFromCart(item, $scope.trader);
                    addToCart(clone, $scope.player);
                },
                onCancel: function () {}
            };

            $scope.sell = {
                label: $sce.trustAsHtml("Offer"),
                onPreview: function (item) {
                    this.label = (item.inCart) ? $sce.trustAsHtml('<span class="fa fa-arrow-down"></span>Give Back') : $sce.trustAsHtml('<span class="fa fa-arrow-down"></span>Offer');
                },
                onAccept: function (item) {
                    var clone = removeFromCart(item, $scope.player);
                    addToCart(clone, $scope.trader);
                },
                onCancel: function () {}
            };

            $scope.back = function () {
                $scope.player.items = undo.player;
                $scope.trader.items = undo.trader;
                $rootScope.back();
            };

        }]);



    app.controller('PickpocketCtrl', ['$scope', '$routeParams', 'playerService', 'npcService', '$sce', '$rootScope',
        function ($scope, $routeParams, playerService, npcService, $sce, $rootScope) {

            var playerReady = false;
            var npcReady = false;
            var undo = {
                player: null,
                npc: null
            };

            function checkReady() {
                $scope.isReady = (playerReady && npcReady);
            }

            // Various.
            $scope.npcId = $routeParams.id;
            $scope.isReady = false;

            // Retrieve player and npc inventories.
            playerService.getPlayer()
                .then(function (data) {
                    $scope.player = data;
                    playerService.getInventory().then(function (data) {
                        undo.player = angular.copy(data.items);
                        $scope.player.items = data.items;
                        playerReady = true;
                        checkReady();
                    });
                });

            npcService.find($scope.npcId)
                .then(function (data) {
                    $scope.npc = data;
                    npcService.getInventory($scope.npcId).then(function (data) {
                        undo.npc = angular.copy(data.items);
                        $scope.npc.items = data.items;
                        npcReady = true;
                        checkReady();
                    });
                });

            $scope.back = function () {
                $scope.player.items = undo.player;
                $scope.npc.items = undo.npc;
                $rootScope.back();
            };

        }]);



    app.controller('MapCtrl', ['$scope', 'regionService',
        function ($scope, regionService) {
            regionService.findAll().then(function (data) {
                $scope.regions = data;
            });
            $scope.preview = function (region) {
                $scope.showcase = region;
            };
        }]);



    app.controller('RegionCtrl', ['$scope', '$routeParams', 'regionService',
        function ($scope, $routeParams, regionService) {
            regionService.find($routeParams.id).then(function (data) {
                console.log(data);
                $scope.region = data;
            });
        }]);



     app.controller('LocationCtrl', ['$scope', '$routeParams', 'locationService', 'playerService',
        function ($scope, $routeParams, locationService, playerService) {
            $scope.showRoom = true;
            $scope.showInventory = false;
            $scope.openVessel = function (id) {
                $scope.vesselId = id;
                $scope.showRoom = false;
                $scope.showInventory = true;
            };
            $scope.closeVessel = function () {
                $scope.showRoom = true;
                $scope.showInventory = false;
            };

            playerService.getPlayer().then(function (data) {
                $scope.player = data;
            });

            locationService.find($routeParams.id).then(function (data) {
                $scope.location = data;
                $scope.room = data.rooms[0];
                console.log($scope.room);
            });

        }]);



    /**
     * Handles the display and events for the inventory.html partial.
     */
    app.controller('InventoryCtrl',
        function () {

            var scope = this;

            function updateBundleValue(item) {
                scope.bundleValue = scope.quantityRequested * item.value;
            }

            scope.bundleValue = 0;

            scope.increaseQuantity = function (item) {
                scope.quantityRequested++;
                if (scope.quantityRequested > item.quantity) {
                    scope.quantityRequested = item.quantity;
                }
                updateBundleValue(item);
            };
            scope.decreaseQuantity = function (item) {
                scope.quantityRequested--;
                if (scope.quantityRequested < 1) {
                    scope.quantityRequested = 1;
                }
                updateBundleValue(item);
            };

            scope.preview = function (item) {
                if (scope.action && scope.action.onPreview) {
                    scope.action.onPreview.call(scope.action, item);
                }
                scope.showcase = item;
            };

            scope.requestQuantity = function (item) {
                console.log("Check quantity: ", item.quantity);
                if (parseInt(item.quantity) === 1) {
                    scope.quantityRequested = 1;
                    scope.accept(item);
                } else {
                    scope.showQuantitySelect = true;
                    scope.quantityRequested = parseInt(item.quantity);
                    updateBundleValue(item);
                }
            };

            scope.accept = function (item) {
                item.quantityRequested = scope.quantityRequested || 1;
                scope.action.onAccept(item);
                scope.cancel();
            };

            scope.cancel = function () {
                delete scope.quantityRequested;
                delete scope.showcase;
                scope.showQuantitySelect = false;
            };

        });



    app.controller('VesselCtrl', ['playerService', 'vesselService',
        function (playerService, vesselService) {
            var scope = this;
            playerService.getPlayer().then(function (data) {
                scope.player = data;
            });
            vesselService.find(scope.vesselId).then(function (data) {
                scope.vessel = data;
            });
        }]);




}(window.angular, window.console));
