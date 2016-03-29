(function (angular) {
    'use strict';

    function VesselFactory(STATION_CONFIG, LogService) {
        var vessels,
            factory;

        factory = this;
        vessels = {};

        function Vessel(options) {
            var defaults,
                that;

            defaults = {};
            that = this;

            for (var o in options) {
                if (options.hasOwnProperty(o)) {
                    that[o] = options[o];
                }
            }
            that.items = that.items || [];
            that.name = that.name || "Backpack";

            function updateGroupValues() {
                that.items.forEach(function (item) {
                    item.groupValue = item.quantity * item.value;
                    item.groupWeight = item.quantity * item.weight;
                });
            }

            that.updateStats = function () {
                updateGroupValues();
                that.getMoney();
                that.getWeight();
            };

            that.addItem = function (item) {
                var found;
                found = false;
                item.isSelected = false;
                if (item.prototypeId && that.items.length > 0) {
                    that.items.forEach(function (anItem) {
                        if (anItem.prototypeId === item.prototypeId) {
                            found = true;
                            anItem.quantity += item.quantity;
                        }
                    });
                    if (!found) {
                        that.items.push(item);
                    }
                } else {
                    that.items.push(item);
                }
                LogService.addMessage(item.name + " added to " + that.name + ".");
                updateGroupValues();
            };

            that.addItems = function (items) {
                items.forEach(function (item) {
                    that.addItem(item);
                });
            };

            that.getItems = function () {
                updateGroupValues();
                return that.items;
            };

            that.getItemById = function (id) {
                var i,
                    len;
                id = id.toString();
                len = that.items.length;
                for (i = 0; i < len; ++i) {
                    if (that.items[i]._id === id) {
                        return that.items[i];
                    }
                }
                return false;
            };

            that.removeItemById = function (id) {
                var i,
                    index,
                    len;

                index = -1;
                id = id.toString();
                len = that.items.length;

                for (i = 0; i < len; ++i) {
                    if (that.items[i]._id === id) {
                        index = i;
                        break;
                    }
                }
                if (index > -1) {
                    that.removeItemByIndex(index);
                }
                that.updateStats();
            };

            that.removeItemByIndex = function (index) {
                that.items.splice(index, 1);
                that.updateStats();
            };

            that.removeAllItems = function () {
                var temp;
                temp = that.items;
                that.items = [];
                return temp;
            };

            that.getMoney = function () {
                var value;
                value = 0;
                that.items.forEach(function (item) {
                    if (item._id === STATION_CONFIG.moneyId) {
                        value += item.value * item.quantity;
                    }
                });
                that.money = value;
                return value;
            };

            that.getWeight = function () {
                var weight;
                weight = 0;
                that.items.forEach(function (item) {
                    weight += (item.weight * item.quantity);
                });
                that.weight = Math.ceil(weight);
                return that.weight;
            };

            that.updateStats();
        }

        factory.getById = function (id) {
            return vessels[id];
        };

        factory.make = function (data) {
            var vessel;
            vessel = vessels[data._id];
            if (vessel) {
                return vessel;
            }
            vessel = vessels[data._id] = new Vessel(data);
            return vessel;
        };

        return factory;
    }

    VesselFactory.$inject = [
        'STATION_CONFIG',
        'LogService'
    ];

    angular.module('station')
        .factory('VesselFactory', VesselFactory);

}(window.angular));
