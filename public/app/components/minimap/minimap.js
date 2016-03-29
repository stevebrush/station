(function (angular) {
    'use strict';

    function stMinimap($timeout) {
        return {
            restrict: 'E',
            scope: true,
            bindToController: {
                'structure': '='
            },
            templateUrl: '../public/app/components/minimap/minimap.html',
            controller: 'MinimapController as minimapCtrl',
            link: function (scope, element, attrs, controller) {
                var mapPane,
                    mapPaneHeight,
                    mapPaneWidth,
                    setDimensions;

                $timeout(function () {
                    mapPane = element[0].querySelector('.dungeon-map-floor-container');
                    mapPaneHeight = mapPane.clientHeight / 2;
                    mapPaneWidth = mapPane.clientWidth / 2;
                });

                setDimensions = function () {
                    var mapFloor,
                        mapRoom;

                    $timeout(function () {
                        mapPane = element[0].querySelector('.dungeon-map-floor-container');
                        mapRoom = mapPane.querySelector('.selected');
                        mapFloor = mapPane.children[0];

                        mapFloor.style.top = Math.round((mapPaneHeight) - mapRoom.offsetTop - (mapRoom.clientHeight / 2)) - 1 + 'px';
                        mapFloor.style.left = Math.round((mapPaneWidth) - mapRoom.offsetLeft - (mapRoom.clientWidth / 2)) - 1 + 'px';
                        mapFloor.className = '';
                    });
                };

                scope.$watchCollection("structureCtrl.room", function (newValue, oldValue) {
                    setDimensions();
                    controller.buildControls(newValue);
                });
            }
        };
    }

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

    function MinimapController($scope, StructureService, utils) {
        var vm;
        vm = this;

        vm.blueprint = generateMinimap(vm.structure);

        vm.buildControls = function (room) {
            var positions;

            positions = ['n', 's', 'e', 'w'];
            room = utils.clone(room);

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

            vm.controls = room;
        };
    }

    stMinimap.$inject = [
        '$timeout'
    ];

    MinimapController.$inject = [
        '$scope',
        'StructureService',
        'utils'
    ];

    angular.module('station')
        .controller('MinimapController', MinimapController)
        .directive('stMinimap', stMinimap);

}(window.angular));
