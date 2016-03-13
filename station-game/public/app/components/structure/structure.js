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
        var vm;

        vm = this;

        function updateStructureStats() {

            var structureNumItemsFound;

            structureNumItemsFound = 0;

            vm.structure.rooms.forEach(function (room) {
                var roomNumItemsFound = room.numItems;
                room.vessels.forEach(function (vessel) {
                    roomNumItemsFound -= vessel.items.length;
                    vessel.numItemsFound = vessel.numItems - vessel.items.length;
                });
                room.numItemsFound = roomNumItemsFound;
                structureNumItemsFound += room.numItemsFound;
            });

            vm.structure.numItemsFound = structureNumItemsFound;
            vm.structure.percentLooted = calculatePercentage(vm.structure.numItemsFound, vm.structure.numItems);
            vm.room.percentExplored = (vm.room.isScanned) ? calculatePercentage(vm.room.numItemsFound, vm.room.numItems) : 0.0;
        }

        StructureService.findStructureById($state.params.locationId, $state.params.structureId).then(function (data) {
            vm.structure = data;
            vm.room = vm.findRoomById(vm.structure.entrance);
            updateStructureStats();
        });

        vm.openVessel = function (vessel) {
            vessel.isOpen = (vessel.isOpen) ? false : true;
            vessel.items.forEach(function (item) {
                item.parent = vessel;
            });
        };

        vm.openDoor = function (door) {
            var key,
                prevRoom,
                room;

            door.entryAttempted = true;
            room = vm.findRoomById(door.roomId);

            if (door.isLocked) {
                key = InventoryService.findItemById(door.keyId);

                if (key) {
                    door.isLocked = false;
                    prevRoom = vm.room;

                    // Also unlock the next room's door.
                    room.doors.forEach(function (door) {
                        if (door.roomId === prevRoom._id) {
                            door.isLocked = false;
                        }
                    });

                    // Set the view's room data.
                    vm.room = room;

                    LogService.addMessage("Used key to " + room.name + ".");
                } else {
                    LogService.addMessage("Door to " + room.name + " is locked.");
                }

                return;
            }

            if (door.isExit) {
                LogService.addMessage("Exiting structure...");
                $state.go('location', { 'id': $state.params.locationId });
                return;
            }

            if (room === undefined) {
                console.log("Room not found...");
                return;
            }

            vm.room = room;
        };

        vm.selectItem = function (item) {
            item.isSelected = true;
        };

        vm.takeAllItems = function (vessel) {
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

        vm.findRoomById = function (id) {
            var i,
                len;

            if (id === undefined) {
                return false;
            }

            len = vm.structure.rooms.length;

            for (i = 0; i < len; ++i) {
                if (vm.structure.rooms[i]._id === id) {
                    return vm.structure.rooms[i];
                }
            }

            return false;
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

    angular.module('station')
        .controller('StructureCtrl', StructureCtrl)
        .directive('stStructure', stStructure);

}(window, window.angular));