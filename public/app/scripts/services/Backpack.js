(function (window, angular) {
    "use strict";

    function BackpackService($rootScope, $q, ConfigService) {
        var items,
            that;

        that = this;
        items = [];

        function updateGroupValues() {
            items.forEach(function (item) {
                item.groupValue = item.quantity * item.value;
                item.groupWeight = item.quantity * item.weight;
            });
        }

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

            updateGroupValues();
        };

        this.getItems = function () {
            updateGroupValues();
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

            updateGroupValues();
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

        this.getWeightTotal = function () {
            var deferred,
                weight;

            deferred = $q.defer();
            weight = 0;

            items.forEach(function (item) {
                weight += (item.weight * item.quantity);
            });

            deferred.resolve({
                weightTotal: weight
            });

            return deferred.promise;
        };
    }

    BackpackService.$inject = [
        '$rootScope',
        '$q',
        'ConfigService'
    ];

    angular.module('station')
        .service('BackpackService', BackpackService);

}(window, window.angular));
