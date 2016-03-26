(function (window, angular) {
    "use strict";

    function StructureController($state, StructureService, CharacterService, LogService, HeaderService, utils) {
        var player,
            vm;

        vm = this;
        vm.locationId = $state.params.locationId;

        StructureService
            .setLocationId($state.params.locationId)
            .getStructureById($state.params.structureId).then(function (data) {

                vm.structure = data;
                vm.room = vm.findRoomById($state.params.roomId);
                //vm.controls = buildControls(vm.room);

                HeaderService.set({
                    title: vm.structure.name
                });

                // Create the player, so we can check the backpack for any keys.
                CharacterService.getPlayer().then(function (data) {
                    player = data;
                    vm.isReady = true;
                });

                // Add characters to rooms.
                // data.characters.forEach(function (character) {
                //     var char = Character.make(character);
                //     data.rooms.forEach(function (room) {
                //         if (char.roomId === room._id) {
                //             room.characters.push(char);
                //         }
                //     });
                // });
            });

        function buildControls(room) {
            var positions;
            room = utils.clone(room);
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
                key = player.backpack.getItemById(door.keyId);
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
                    //vm.controls = buildControls(room);
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
            //vm.controls = buildControls(room);
            if (room.isScanned) {
                LogService.addMessage(room.description);
            }
        };

        vm.scanRoom = function (room) {
            LogService.addMessage(room.name + " scanned.");
            LogService.addMessage(room.description);
            room.isScanned = true;
        };

        vm.findRoomById = function (id) {
            var i,
                k,
                roomsLength,
                structuresLength;

            if (id === undefined) {
                return false;
            }

            structuresLength = vm.structure.floors.length;

            for (k = 0; k < structuresLength; ++k) {
                roomsLength = vm.structure.floors[k].rooms.length;
                for (i = 0; i < roomsLength; ++i) {
                    if (vm.structure.floors[k].rooms[i]._id === id) {
                        return vm.structure.floors[k].rooms[i];
                    }
                }
            }
            return false;
        };
    }

    StructureController.$inject = [
        '$state',
        'StructureService',
        'CharacterService',
        'LogService',
        'HeaderService',
        'utils'
    ];

    angular.module('station')
        .controller('StructureController', StructureController);

}(window, window.angular));
