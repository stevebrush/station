(function (window, angular) {
    "use strict";

    function InventoryService() {
        var items;

        items = [];

        this.addItem = function (item) {
            items.push(item);
        };

        this.getItems = function () {
            return items;
        };

        this.findItemById = function (id) {
            var i,
                len;
            id = id.toString();
            len = items.length;
            for (i = 0; i < len; ++i) {
                if (items[i]._id === id) {
                    return items[i];
                }
            }
            return false;
        };

        this.removeItemById = function (id) {
            var i,
                index,
                len;
            index = -1;
            id = id.toString();
            len = items.length;
            for (i = 0; i < len; ++i) {
                if (items[i]._id === id) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                items.splice(index, 1);
            }
        };
    }

    angular.module('station')
        .service('InventoryService', InventoryService);

}(window, window.angular));