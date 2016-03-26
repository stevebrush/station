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

                            scope.$digest();
                        }, 0);
                    };


                    try {
                        setDimensions(scope.$parent.$parent.structureCtrl.room);
                        //
                    } catch (e) {}

                    scope.$watch("structureCtrl.room", function (newValue, oldValue) {
                        setDimensions();
                        controller.buildControls(newValue);
                    });
                });
            }
        };
    }

    function MinimapController($scope, StructureService, utils) {
        var structure,
            vm;

        vm = this;

        function generateMinimap(structure) {
            var floors;

            floors = structure.floors;

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

                    room.left = left;
                    room.top = top;
                    room.width = width;
                    room.height = height;
                });
            });

            return {
                floors: floors
            };
        }

        StructureService.setLocationId(vm.locationId).getStructureById(vm.structureId).then(function (data) {
            vm.structure = generateMinimap(data);
        });

        vm.buildControls = function (room) {
            console.log("Build controls:", room.name);
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
            console.log("Controls built:", room);
            vm.controls = room;
        };
    }

    MinimapController.$inject = [
        '$scope',
        'StructureService',
        'utils'
    ];

    angular.module('station')
        .controller('MinimapController', MinimapController)
        .directive('stMinimap', stMinimap);

}(window.angular));
