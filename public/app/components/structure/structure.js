(function (window, angular) {
    "use strict";

/*
    Array.prototype.move = function (old_index, new_index) {
        while (old_index < 0) {
            old_index += this.length;
        }
        while (new_index < 0) {
            new_index += this.length;
        }
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        return this; // for testing purposes
    };
*/

    function cleanArray(arr) {
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i] === undefined) {
                arr.splice(i, 1);
                i--;
            }
        }
        return arr;
    }

    function StructureCtrl($scope, $state, StructureService, InventoryService, LogService, HeaderService) {
        var elemMinimapRoom,
            structure,
            vm;

        vm = this;
        vm.locationId = $state.params.locationId;

        StructureService.setLocationId($state.params.locationId).getStructureById($state.params.structureId).then(function (data) {
            vm.structure = data;
            vm.room = vm.findRoomById($state.params.roomId);
            HeaderService.setTitle(vm.structure.name);
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
            console.log(vm.room.name);
            vm.controls = buildControls(room);
            $scope.$digest();
        };

        var getDoorByPosition = function (position) {
            var found;
            found = false;
            vm.room.doors.forEach(function (door) {
                if (door.position === position) {
                    found = door;
                    return;
                }
            });
            return found;
        };

        var $document = angular.element(document);
        $document.ready(function () {
            $document.on('keydown', function (event) {
                var door;
                switch (event.which) {
                    // left
                    case 37:
                    door = getDoorByPosition('w');
                    break;
                    // up
                    case 38:
                    door = getDoorByPosition('n');
                    break;

                    // right
                    case 39:
                    door = getDoorByPosition('e');
                    break;

                    // down
                    case 40:
                    door = getDoorByPosition('s');
                    break;
                }

                if (door) {
                    vm.openDoor(door);
                }
            });
        });

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

                        var room = vm.structure.floors[k].rooms[i];
                        // var positions = ['n', 's', 'e', 'w'];
                        //
                        // positions.forEach(function (position) {
                        //     var found = false;
                        //     room.doors.forEach(function (door) {
                        //         if (found) {
                        //             return;
                        //         }
                        //         if (door.position === position) {
                        //             found = true;
                        //         }
                        //     });
                        //     if (found === false) {
                        //         room.doors.push({
                        //             name: "",
                        //             position: position
                        //         });
                        //     }
                        // });

                        return room;
                    }
                }
            }

            return false;
        };
    }

    StructureCtrl.$inject = [
        '$scope',
        '$state',
        'StructureService',
        'InventoryService',
        'LogService',
        'HeaderService'
    ];

    angular.module('station')
        .controller('StructureCtrl', StructureCtrl);

}(window, window.angular));
