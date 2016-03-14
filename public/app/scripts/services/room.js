(function (window, angular) {
    "use strict";

    function calculatePercentage(part, total) {
        return (part && part > 0) ? (part / total).toFixed(2) : 0.0;
    }

    function RoomService() {
        this.getNumItemsFound = function (room) {
            var i,
                len1,
                numItemsFound;

            numItemsFound = room.numItems;
            len1 = room.vessels.length;

            for (i = 0; i < len1; ++i) {
                numItemsFound -= room.vessels[i].items.length;
            }

            room.numItemsFound = numItemsFound;

            room.percentExplored = calculatePercentage(room.numItemsFound, room.numItems);

            if (room.numItemsFound === room.numItems) {
                room.isVisited = true;
            }

            return room;
        };
    }

    angular.module('station')
        .service('RoomService', RoomService);

}(window, window.angular));