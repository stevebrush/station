(function () {
    "use strict";

    var DatabaseObject,
        utils;


    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');


    function Item(options) {
        var that;

        DatabaseObject.call(this, options);

        that = this;
    }


    utils.mixin(Item, DatabaseObject);


    Item.static = {};

    Item.static.getRandomQuantity = function (max) {
        return (max > 1) ? Math.floor((Math.random() * max) + 1) : 1;
    };

    Item.static.template = function (name, options) {
        Item.static.templates[name] = options;
        return Item.static;
    };

    Item.static.templates = {};


    module.exports = Item;
}());