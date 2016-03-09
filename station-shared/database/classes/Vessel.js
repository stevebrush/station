(function () {
    'use strict';

    var DatabaseObject,
        Item,
        merge,
        Queue,
        templates,
        utils;

    merge = require('merge');
    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');
    Queue = require(__dirname + '/Queue');
    Item = require(__dirname + '/Item');

    templates = {};

    function Vessel(options) {
        var defaults,
            settings,
            that;

        defaults = templates[options.name.replace(">", "")];
        settings = merge.recursive(true, defaults, options);
        settings.name = defaults.name;

        DatabaseObject.call(this, settings);
        Queue.call(this);

        that = this;

        that.ready(function () {
            var onCreateResponse,
                temp;

            // If the vessel has an onCreate callback, let's fire it.
            if (typeof settings.onCreate === "function") {

                onCreateResponse = {};
                settings.onCreate.call(onCreateResponse);

                if (onCreateResponse.hasOwnProperty('items')) {
                    temp = that.getQueue('items') || [];

                    onCreateResponse.items.forEach(function (item) {
                        temp.push(item);
                    });

                    that.enqueue('items', temp);
                }
            }

            that.queue('items', function (item) {

                that.db.document().numItems++;
                that.parent.db.document().numItems++;
                that.parent.parent.db.document().numItems++;
                that.parent.parent.parent.db.document().numItems++;

                // Initialize the item object.
                item.init(that.db.create('items', item.dbValues), that);
            });

            return that;
        });
    }


    // Mixins.
    utils.mixin(Vessel, DatabaseObject);
    utils.mixin(Vessel, Queue);


    Vessel.prototype.items = function (items) {
        this.enqueue('items', items);
        return this;
    };


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