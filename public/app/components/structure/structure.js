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

    function StructureCtrl($state, Structure, InventoryService, LogService, StorageService) {
        var structure,
            vm;

        vm = this;

        structure = new Structure({
            locationId: $state.params.locationId,
            structureId: $state.params.structureId
        });

        structure.ready(function (data) {
            vm.structure = data;
            vm.room = vm.findRoomById($state.params.roomId);
        });

        vm.openDoor = function (door) {
            var key,
                room;

            door.entryAttempted = true;
            room = vm.findRoomById(door.roomId);

            // Set the previous room.
            if (room.doors) {
                room.doors.forEach(function (door) {
                    door.isPrevious = false;
                    if (door.roomId === vm.room._id) {
                        door.isPrevious = true;
                    }
                });
            }

            if (door.isLocked) {
                key = InventoryService.getItemById(door.keyId);

                if (key) {
                    door.isLocked = false;

                    // Also unlock the next room's door.
                    room.doors.forEach(function (door) {
                        if (door.roomId === vm.room._id) {
                            door.isLocked = false;
                        }
                    });

                    // Set the view's room data.
                    vm.room = room;

                    LogService.addMessage("Used key to " + room.name + ".");
                } else {
                    LogService.addMessage("Door is locked.");
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

            door.isPrevious = true;
            vm.room = room;
        };

        vm.openVessel = function (vessel) {
            vessel.isOpen = (vessel.isOpen) ? false : true;
            vessel.items.forEach(function (item) {
                item.parent = vessel;
            });
        };

        vm.scanRoom = function (room) {
            LogService.addMessage(room.name + " scanned.");
            room.isScanned = true;
        };

        vm.selectItem = function (item) {
            item.isSelected = (item.isSelected) ? false : true;
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
        };

        /**
         * Returns a room within the structure, based on its ID.
         */
        vm.findRoomById = function (id) {
            var i,
                len;

            if (id === undefined) {
                return false;
            }

            for (var k = 0; k < vm.structure.floors.length; ++k) {
                len = vm.structure.floors[k].rooms.length;
                for (i = 0; i < len; ++i) {
                    if (vm.structure.floors[k].rooms[i]._id === id) {
                        return vm.structure.floors[k].rooms[i];
                    }
                }
            }

            return false;
        };
    }

    StructureCtrl.$inject = [
        '$state',
        'Structure',
        'InventoryService',
        'LogService',
        'StorageService'
    ];

    angular.module('station')
        .controller('StructureCtrl', StructureCtrl)
        .directive('stStructure', stStructure);

}(window, window.angular));