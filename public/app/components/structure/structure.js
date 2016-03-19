(function (window, angular) {
    "use strict";

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

    function StructureCtrl($state, Structure, InventoryService, LogService) {
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
            vm.minimap = generateMinimap(data);
            vm.controls = buildControls(vm.room);
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

        function generateMinimap(structure) {
            var floors = JSON.parse(JSON.stringify(structure.floors));

            function getRoomById(id) {
                var found;
                found = false;
                floors.forEach(function (floor) {
                    floor.rooms.forEach(function (room) {
                        if (room._id === id) {
                            found = room;
                        }
                    });
                });
                return found;
            }

            function setRoomDefaultCoords(room, x, y) {
                room.defaultsSet = true;
                room.x = x;
                room.y = y;
                room.doors.forEach(function (door) {
                    var nextRoom;
                    nextRoom = getRoomById(door.roomId);
                    if (room.defaultsSet === false) {
                        setRoomDefaultCoords(nextRoom, x, y);
                    }
                });
            }

            function addCoordsToRoom(room) {
                room.isChecked = true;
                room.doors.forEach(function (door) {
                    var nextRoom;
                    nextRoom = getRoomById(door.roomId);

                    if (nextRoom.isChecked === false) {

                        // Update this door's coordinates.
                        switch (door.position) {
                            case "n":
                            nextRoom.y = room.y - 1;
                            break;
                            case "s":
                            nextRoom.y = room.y + 1;
                            break;
                            case "e":
                            nextRoom.x = room.x + 1;
                            break;
                            case "w":
                            nextRoom.x = room.x - 1;
                            break;
                        }

                        // The next room is on another floor.
                        if (door.isRamp) {

                            // Set all rooms default coordinates to the door on the previous side of the ramp.
                            setRoomDefaultCoords(nextRoom, room.x, room.y);
                            // switch (door.position) {
                            //     case "n":
                            //     setRoomDefaultCoords(nextRoom, room.x, room.y - 1);
                            //     break;
                            //     case "s":
                            //     setRoomDefaultCoords(nextRoom, room.x, room.y + 1);
                            //     break;
                            //     case "e":
                            //     setRoomDefaultCoords(nextRoom, room.x + 1, room.y);
                            //     break;
                            //     case "w":
                            //     setRoomDefaultCoords(nextRoom, room.x - 1, room.y);
                            //     break;
                            // }
                            addCoordsToRoom(nextRoom);
                            return;
                        }
                        addCoordsToRoom(nextRoom);
                    }
                });
            }

            // Set some defaults.
            floors.forEach(function (floor) {
                floor.rooms.forEach(function (room) {
                    room.x = 0;
                    room.y = 0;
                    room.isChecked = false;
                });
            });

            // Determine room coordinates.
            floors.forEach(function (floor) {
                floor.rooms.forEach(function (room) {
                    addCoordsToRoom(room);
                });
            });

            // Determine room dimensions.
            floors.forEach(function (floor) {
                floor.rooms.forEach(function (room) {
                    var height,
                        left,
                        margin,
                        top,
                        width;

                    width = 20;
                    height = 20;
                    margin = 4;

                    // Get the width of the rooms.
                    left = room.x * (width + margin);
                    top = room.y * (height + margin);

                    // Add surrounding margins.
                    left = (left >= 0) ? left + margin: left - margin;
                    top = (top >= 0) ? top + margin: top - margin;

                    room.x = left;
                    room.y = top;
                    room.width = width;
                    room.height = height;
                });
            });


            return {
                floors: floors
            };
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
            vm.controls = buildControls(room);
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
        '$state',
        'Structure',
        'InventoryService',
        'LogService'
    ];

    angular.module('station')
        .controller('StructureCtrl', StructureCtrl)
        .directive('stStructure', stStructure);

}(window, window.angular));
