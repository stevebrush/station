(function (window, angular) {
    "use strict";

    function StructureController($state, $timeout, StructureService, CharacterService, LogService, HeaderService, utils) {
        var player,
            vm;

        vm = this;
        vm.locationId = $state.params.locationId;

        StructureService
            .setLocationId($state.params.locationId)
            .getStructureById($state.params.structureId).then(function (data) {

                vm.structure = data;
                vm.room = vm.findRoomById($state.params.roomId);

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

        vm.openDoor = function (door) {
            var key,
                room;

            door.entryAttempted = true;
            room = vm.findRoomById(door.roomId);

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

                    vm.room = room;

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

            vm.room = room;

            if (room.isScanned) {
                LogService.addMessage(room.description);
            }
        };

        vm.scanRoom = function () {
            LogService.addMessage(vm.room.description);
            vm.room.isScanned = true;
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
        '$timeout',
        'StructureService',
        'CharacterService',
        'LogService',
        'HeaderService',
        'utils'
    ];

    angular.module('station')
        .controller('StructureController', StructureController);

}(window, window.angular));
