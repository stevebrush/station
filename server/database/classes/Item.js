(function () {
    "use strict";

    var DatabaseObject,
        ItemTemplate,
        utils;


    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');
    ItemTemplate = require('../models/item-template');


    function Item(options) {
        var that;

        DatabaseObject.call(this, options);

        that = this;

        that.ready(function () {
            if (typeof that.settings.onCreate === "function") {
                that.settings.onCreate.call(that);
            }
        });
    }


    utils.mixin(Item, DatabaseObject);


    // Static methods.
    Item.static = {};

    Item.static.getRandomQuantity = function (max) {
        return (max > 1) ? Math.floor((Math.random() * max) + 1) : 1;
    };

    Item.static.getTemplateValues = function (slug) {
        var template,
            obj;

        template = Item.static.templates[slug.replace(">", "")];
        obj = template.toObject();

        obj.onCreate = template.onCreate;
        obj.prototypeId = obj._id;

        return obj;
    };

    Item.static.template = function (name, options) {
        var template;
        template = new ItemTemplate(options);
        template.onCreate = options.onCreate;
        Item.static.templates[name] = template;
        return Item.static;
    };

    Item.static.templates = {};


    module.exports = Item;
}());
