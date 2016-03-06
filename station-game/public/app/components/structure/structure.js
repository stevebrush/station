(function (window, angular) {
    "use strict";

    function cleanArray(arr) {
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i] === undefined) {
                arr.splice(i, 1);
                i--;
            }
        }
        return arr;
    }

    function calculatePercentage(part, total) {
        return (part && part > 0) ? (part / total).toFixed(2) : 0.0;
    }

    function stStructure() {
        return {
            restrict: 'AEC',
            scope: true,
            bindToController: {
                "id": "@"
            },
            templateUrl: '../public/app/components/structure/structure.html',
            controller: 'StructureCtrl as structureCtrl'
        };
    }

    function stInventory() {
        return {
            restrict: 'AEC',
            templateUrl: '../public/app/components/inventory/inventory.html',
            controller: 'InventoryCtrl as inventoryCtrl'
        };
    }

    function stLog() {
        return {
            restrict: 'AEC',
            templateUrl: '../public/app/components/log/log.html',
            controller: 'LogCtrl as logCtrl'
        };
    }

    function stUtilities() {
        return {
            restrict: 'AEC',
            templateUrl: '../public/app/components/utilities/utilities.html',
            controller: 'UtilitiesCtrl as utilitiesCtrl'
        };
    }

    function StructureCtrl($state, StructureService, InventoryService, LogService, RoomService, StorageService) {
        var _vessel,
            structure,
            vm;

        vm = this;

        function updateStructureStats() {
            var numItemsFound;

            numItemsFound = vm.numItems;

            structure.rooms.forEach(function (room) {
                room.vessels.forEach(function (vessel) {
                    numItemsFound -= vessel.items.length;
                });
            });

            vm.numItemsFound = numItemsFound;
            vm.percentExplored = calculatePercentage(vm.numItemsFound, vm.numItems);
        }

        StructureService.getStructureById($state.params.locationId, $state.params.structureId).then(function (res) {
            structure = res.structure;
            vm.name = structure.name;
            vm.room = vm.getRoomById(structure.entrance);
            vm.numItems = structure.numItems;
            vm.numItemsFound = structure.numItemsFound;
            updateStructureStats();
            StorageService.secure(structure);
            console.log("Structure:", structure);
        });

        vm.openVessel = function (vessel) {
            vessel.isOpen = (vessel.isOpen) ? false : true;
            _vessel = vessel;
        };

        vm.openDoor = function (door) {
            var room;

            if (door.isExit) {
                LogService.addMessage("Exiting structure...");
                return;
            }

            room = vm.getRoomById(door.roomId);

            if (room === undefined) {
                console.log("Room not found...");
                return;
            }

            if (room.isLocked) {
                if (InventoryService.getItemById(room._id)) {
                    door.isLocked = false;
                    room.isLocked = false;
                    InventoryService.removeItemById(room._id);
                    LogService.addMessage("Used key to " + room.name + ".");
                } else {
                    LogService.addMessage("Door to " + room.name + " is locked.");
                    door.isLocked = true;
                    return;
                }
            }

            vm.room = room;
        };

        vm.selectItem = function (item) {
            _vessel.items.forEach(function (thisItem, i) {
                if (thisItem._id === item._id) {
                    LogService.addMessage(item.name + " added to inventory.");
                    InventoryService.addItem(item);
                    delete _vessel.items[i];
                }
            });

            cleanArray(_vessel.items);

            if (_vessel.items.length === 0) {
                vm.openVessel(_vessel);
            }

            RoomService.getNumItemsFound(vm.room);
            updateStructureStats();
        };

        vm.scanRoom = function (room) {
            LogService.addMessage("Scanning " + room.name + "...");
            room.isScanned = true;
            RoomService.getNumItemsFound(room);
            updateStructureStats();
        };

        vm.getRoomById = function (id) {
            var i,
                len;

            if (id === undefined) {
                return false;
            }

            len = structure.rooms.length;

            for (i = 0; i < len; ++i) {
                if (structure.rooms[i]._id === id) {
                    return structure.rooms[i];
                }
            }
        };
    }

    function StructureService($http, $q) {
        var structure;

        this.getStructureById = function (locationId, structureId) {
            var deferred;

            deferred = $q.defer();

            if (structure !== undefined) {
                if (structure.id === structureId) {
                    deferred.resolve(structure);
                }
            } else {

                $http.get('/api/location/' + locationId + '/structure/' + structureId).then(function (res) {
                    deferred.resolve(res.data);
                    /*
var i,
                        len;
                    len = res.data.structures.length;
                    for (i = 0; i < len; ++i) {
                        if (res.data.structures[i].id === id) {
                            structure = res.data.structures[i];
                            deferred.resolve(structure);
                        }
                    }
*/
                });
            }

            return deferred.promise;
        };

        this.getStructure = function () {
            return structure;
        };
    }

    function InventoryCtrl(InventoryService) {
        var vm;

        vm = this;

        vm.items = InventoryService.getItems();
    }

    function InventoryService() {
        var items;

        items = [];

        this.addItem = function (item) {
            items.push(item);
        };

        this.getItems = function () {
            return items;
        };

        this.getItemById = function (id) {
            var i,
                len;
            id = id.toString();
            len = items.length;
            for (i = 0; i < len; ++i) {
                if (items[i]._id === id) {
                    return items[i];
                }
            }
        };

        this.removeItemById = function (id) {
            var i,
                index,
                len;
            index = -1;
            id = id.toString();
            len = items.length;
            for (i = 0; i < len; ++i) {
                if (items[i]._id === id) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                items.splice(index, 1);
            }
        };
    }

    function LogCtrl(LogService) {
        var vm;

        vm = this;

        vm.messages = LogService.getMessages();
    }

    function LogService() {
        var messages;

        messages = [];

        this.addMessage = function (message) {
            messages.unshift({
                text: message
            });
        };

        this.getMessages = function () {
            return messages;
        };
    }

    function RoomService() {
        this.getNumItemsFound = function (room) {
            var i,
                len1,
                numItemsFound;

            numItemsFound = room.numItems;
            len1 = room.vessels.length;

            for (i = 0; i < len1; ++i) {
                numItemsFound -= room.vessels[i].items.length;
            }

            room.numItemsFound = numItemsFound;

            room.percentExplored = calculatePercentage(room.numItemsFound, room.numItems);

            if (room.numItemsFound === room.numItems) {
                room.isVisited = true;
            }

            return room;
        };
    }

    function StorageService() {
        var securred;

        securred = {};

        this.secure = function (data) {
            // Stores stuff locally, but not eternally.
            //console.log("Securing " + data.storageKey, data);
        };
        this.save = function () {
            // Takes the locally "secured" stuff, and saves it eternally.
        };
    }

    function UtilitiesCtrl(StorageService) {
        var vm;

        vm = this;

        vm.save = function () {
            console.log("Save game1");
            /**
                When user clicks "save", retrieve all locally changed items, and push them to local storage.


             */
        };

        vm.reset = function () {
            console.log("Reset game1");
        };
    }

    function filterPercentage($filter) {
        return function (input, decimals) {
            if (decimals === undefined) {
                decimals = 0;
            }
            return $filter('number')(input * 100, decimals) + '%';
        };
    }

    filterPercentage.$inject = [
        '$filter'
    ];

    StructureCtrl.$inject = [
        '$state',
        'StructureService',
        'InventoryService',
        'LogService',
        'RoomService',
        'StorageService'
    ];

    StructureService.$inject = [
        '$http',
        '$q'
    ];

    InventoryCtrl.$inject = [
        'InventoryService'
    ];

    LogCtrl.$inject = [
        'LogService'
    ];

    UtilitiesCtrl.$inject = [
        'StorageService'
    ];

    angular.module('station')
        .controller('StructureCtrl', StructureCtrl)
        .controller('InventoryCtrl', InventoryCtrl)
        .controller('LogCtrl', LogCtrl)
        .controller('UtilitiesCtrl', UtilitiesCtrl)
        .directive('stStructure', stStructure)
        .directive('stInventory', stInventory)
        .directive('stLog', stLog)
        .directive('stUtilities', stUtilities)
        .filter('percentage', filterPercentage)
        .service('StorageService', StorageService)
        .service('StructureService', StructureService)
        .service('InventoryService', InventoryService)
        .service('LogService', LogService)
        .service('RoomService', RoomService);

}(window, window.angular));