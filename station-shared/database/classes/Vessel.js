(function () {
    'use strict';

    var Item,
        merge,
        templates,
        utils;

    merge = require('merge');
    utils = require('../utils');
    Item = require(__dirname + '/Item');

    templates = {};

    function Vessel(options) {
        var defaults,
            settings,
            that,
            waiting;

        defaults = templates[options.name.replace(">", "")];
        settings = merge.recursive(true, defaults, options);
        settings.name = defaults.name;

        that = this;
        that.dbObject = undefined;
        that.dbValues = settings;
        that.trail = "";
        that.slug = utils.slugify(settings.name);

        waiting = {};

        that.init = function (dbObject, parent) {
            var onCreateResponse;

            // Receive the database object assigned by this structure's location.
            that.dbObject = dbObject;
            that.trail = parent.trail + "|" + that.slug;

            // If the vessel has an onCreate callback, let's fire it.
            if (typeof settings.onCreate === "function") {
                onCreateResponse = {};
                settings.onCreate.call(onCreateResponse);
                if (onCreateResponse.hasOwnProperty('items')) {
                    waiting.items = waiting.items || [];
                    onCreateResponse.items.forEach(function (item) {
                        waiting.items.push(item);
                    });
                }
            }

            if (waiting.hasOwnProperty('items')) {

                // For each item object...
                waiting.items.forEach(function (item) {

                    // Add it to the structure's document.
                    that.dbObject.items.push(item.dbValues);

                    // Initialize the item object.
                    item.init(that.dbObject.items[that.dbObject.items.length - 1], that);
                });
            }

            return that;
        };

        // Add items to the waiting list.
        that.items = function (items) {
            waiting.items = items;
            return that;
        };

        return that;
    }

    function mayContain(items) {
        var temp;

        temp = [];

        items.forEach(function (item, i) {
            var itemTemplate;

            // Is this item referencing a template?
            if (item.name.indexOf(">") === 0) {

                itemTemplate = Item.static.templates[item.name.replace(">", "")];

                if (itemTemplate !== undefined) {
                    item = merge.recursive(true, itemTemplate, item);
                    item.name = itemTemplate.name;
                }
            }

            // Should the item be included in the container?
            if (item.chance > Math.random()) {
                delete item.chance;
                temp.push(new Item(item));
            }
        });

        return temp;
    }

    function template(name, options) {
        templates[name] = options;
        return Vessel.static;
    }

    Vessel.static = {
        mayContain: mayContain,
        template: template,
        templates: templates
    };

    module.exports = Vessel;
}());