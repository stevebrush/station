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

    function StructureCtrl($state, StructureService, InventoryService, LogService, HeaderService) {
        var elemMinimapRoom,
            vm;

        vm = this;
        vm.locationId = $state.params.locationId;

        StructureService.setLocationId($state.params.locationId).getStructureById($state.params.structureId).then(function (data) {
            vm.structure = data;
            vm.room = vm.findRoomById($state.params.roomId);
            HeaderService.set({
                title: vm.structure.name
            });
            vm.controls = buildControls(vm.room);
            vm.isReady = true;
        });

        function buildControls(room) {
            var positions;
            room = JSON.parse(JSON.stringify(room));
            positions = ['n', 's', 'e', 'w'];
            positions.forEach(function (position) {
                var found = false;
                room.doors.forEach(function (door) {
                    if (found) {
                        return;
                    }
                    if (door.position === position) {
                        found = true;
                    }
                });
                if (found === false) {
                    room.doors.push({
                        name: "",
                        position: position
                    });
                }
            });
            return room;
        }

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
                    vm.controls = buildControls(room);
                    door.isPrevious = true;

                    LogService.addMessage("Used key to " + room.name + ".");
                } else {
                    LogService.addMessage("Door is locked.");
                }

                return;
            }

            if (door.isExit) {
                LogService.addMessage("Exited " + vm.structure.name + ".");
                $state.go('location', { 'id': $state.params.locationId });
                return;
            }

            if (room === undefined) {
                console.log("Room not found...");
                return;
            }

            door.isPrevious = true;
            vm.room = room;
            vm.controls = buildControls(room);
            if (room.isScanned) {
                LogService.addMessage(room.description);
            }
        };

        // var getDoorByPosition = function (position) {
        //     var found;
        //     found = false;
        //     console.log("Opening door for:", vm.room.name);
        //     vm.room.doors.forEach(function (door) {
        //         if (door.position === position) {
        //             found = door;
        //             return;
        //         }
        //     });
        //     return found;
        // };

        // var $document = angular.element(document);
        // $document.ready(function () {
        //     $document.on('keydown', function (event) {
        //         var door;
        //         switch (event.which) {
        //             // left
        //             case 37:
        //             door = getDoorByPosition('w');
        //             break;
        //             // up
        //             case 38:
        //             door = getDoorByPosition('n');
        //             break;
        //
        //             // right
        //             case 39:
        //             door = getDoorByPosition('e');
        //             break;
        //
        //             // down
        //             case 40:
        //             door = getDoorByPosition('s');
        //             break;
        //         }
        //
        //         if (door) {
        //             vm.openDoor(door);
        //         }
        //     });
        // });

        vm.openVessel = function (vessel) {
            vessel.isOpen = (vessel.isOpen) ? false : true;
            vessel.items.forEach(function (item) {
                item.parent = vessel;
            });
        };

        vm.scanRoom = function (room) {
            LogService.addMessage(room.name + " scanned.");
            LogService.addMessage(room.description);
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
        'StructureService',
        'InventoryService',
        'LogService',
        'HeaderService'
    ];

    angular.module('station')
        .controller('StructureCtrl', StructureCtrl);

}(window, window.angular));
