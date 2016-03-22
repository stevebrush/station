(function (window, angular) {
    "use strict";

    function InventoryService($q, ConfigService) {
        var items;

        items = [];

        this.addItem = function (item) {
            var found;

            found = false;
            delete item.parent;

            if (item.prototypeId && items.length > 0) {
                items.forEach(function (anItem) {
                    if (anItem.prototypeId === item.prototypeId) {
                        found = true;
                        anItem.quantity += item.quantity;
                    }
                });
                if (!found) {
                    items.push(item);
                }
            } else {
                items.push(item);
            }

            this.updateGroupValues();
        };

        this.getItems = function () {
            this.updateGroupValues();
            return items;
        };

        this.getItemById = function (id) {
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

            this.updateGroupValues();
        };

        this.updateGroupValues = function () {
            items.forEach(function (item) {
                item.groupValue = item.quantity * item.value;
            });
        };

        this.getMoneyTotal = function () {
            var deferred,
                value;

            deferred = $q.defer();
            value = 0;

            ConfigService.get('moneyId').then(function (data) {
                items.forEach(function (item) {
                    if (item._id === data.moneyId) {
                        value += item.value * item.quantity;
                    }
                });
                deferred.resolve({
                    moneyTotal: value
                });
            });
            return deferred.promise;
        };
    }

    InventoryService.$inject = [
        '$q',
        'ConfigService'
    ];

    angular.module('station')
        .service('InventoryService', InventoryService);

}(window, window.angular));
