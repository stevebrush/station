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

    function StructureCtrl($state, StructureService, InventoryService, LogService, RoomService, StorageService) {
        var structure,
            vm;

        vm = this;

        function updateStructureStats() {

            var structureNumItemsFound;

            structureNumItemsFound = 0;

            structure.rooms.forEach(function (room) {
                var roomNumItemsFound = room.numItems;

                room.vessels.forEach(function (vessel) {
                    roomNumItemsFound -= vessel.items.length;
                    vessel.numItemsFound = vessel.numItems - vessel.items.length;
                });

                room.numItemsFound = roomNumItemsFound;
                structureNumItemsFound += room.numItemsFound;
            });

            vm.numItemsFound = structureNumItemsFound;
            vm.percentExplored = calculatePercentage(vm.numItemsFound, vm.numItems);
            vm.room.percentExplored = (vm.room.isScanned) ? calculatePercentage(vm.room.numItemsFound, vm.room.numItems) : 0.0;
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
            vessel.items.forEach(function (item) {
                item.parent = vessel;
            });
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
            item.isSelected = true;
        };

        vm.takeAllItems = function (vessel) {
            console.log("Take all: ", vessel.items);
            vessel.items.forEach(function (item, i) {
                LogService.addMessage(item.name + " added to inventory.");
                InventoryService.addItem(item);
                delete vessel.items[i];
            });

            cleanArray(vessel.items);

            if (vessel.items.length === 0) {
                vm.openVessel(vessel);
            }

            RoomService.getNumItemsFound(vm.room);
            updateStructureStats();
        };

        vm.takeItem = function (item) {
            item.parent.items.forEach(function (thisItem, i) {
                if (thisItem._id === item._id) {
                    LogService.addMessage(item.name + " added to inventory.");
                    InventoryService.addItem(item);
                    delete item.parent.items[i];
                }
            });

            cleanArray(item.parent.items);

            if (item.parent.items.length === 0) {
                vm.openVessel(item.parent);
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

    angular.module('station')
        .controller('StructureCtrl', StructureCtrl)
        .directive('stStructure', stStructure)
        .service('StructureService', StructureService);

}(window, window.angular));