(function (angular) {
    'use strict';

    function stMinimap() {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            bindToController: {
                'structureId': '@',
                'locationId': '@'
            },
            templateUrl: '../public/app/components/minimap/minimap.html',
            controller: 'MinimapController as minimapCtrl',
            link: function (scope, element, attrs, controller, transcludeFn) {
                angular.element(document).ready(function () {
                    var mapPane,
                        mapPaneHeight,
                        mapPaneWidth,
                        setDimensions;

                    mapPane = element[0].querySelector('.dungeon-map-floor-container');
                    mapPaneHeight = mapPane.clientHeight / 2;
                    mapPaneWidth = mapPane.clientWidth / 2;

                    setDimensions = function () {
                        var mapFloor,
                            mapRoom;

                        window.setTimeout(function () {
                            mapPane = element[0].querySelector('.dungeon-map-floor-container');
                            mapRoom = mapPane.querySelector('.selected');
                            mapFloor = mapPane.children[0];

                            mapFloor.style.top = Math.round((mapPaneHeight) - mapRoom.offsetTop - (mapRoom.clientHeight / 2)) - 1 + 'px';
                            mapFloor.style.left = Math.round((mapPaneWidth) - mapRoom.offsetLeft - (mapRoom.clientWidth / 2)) - 1 + 'px';
                            mapFloor.className = '';
                        }, 0);
                    };

                    setDimensions();

                    scope.$watch(
                        "structureCtrl.room",
                        function handleWatchValueChange(newValue, oldValue) {
                            setDimensions();
                        }
                    );

                });

            }
        };
    }

    function MinimapController($scope, StructureService) {
        var structure,
            vm;

        vm = this;

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

                    width = 33;
                    height = 33;
                    margin = 6;

                    // Get the width of the rooms.
                    left = room.x * (width + margin);
                    top = room.y * (height + margin);

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

        StructureService.setLocationId(vm.locationId).getStructureById(vm.structureId).then(function (data) {
            console.log("Structure fetched for minimap...");
            vm.structure = generateMinimap(data);
        });
    }

    MinimapController.$inject = [
        '$scope',
        'StructureService'
    ];

    angular.module('station')
        .controller('MinimapController', MinimapController)
        .directive('stMinimap', stMinimap);

}(window.angular));
