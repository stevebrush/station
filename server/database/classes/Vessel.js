(function () {
    'use strict';

    var DatabaseObject,
        Item,
        Queue,
        utils;

    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');
    Queue = require(__dirname + '/Queue');
    Item = require(__dirname + '/Item');

    function Vessel(options) {
        var that;

        // Is the client asking for a template?
        if (options.name.indexOf(">") === 0) {
            this.defaults = Vessel.static.templates[options.name.replace(">", "")];
            options.name = this.defaults.name;
        }

        DatabaseObject.call(this, options);
        Queue.call(this);

        that = this;

        that.ready(function () {
            var sandbox,
                temp;

            // If the vessel has an onCreate callback, let's fire it.
            if (typeof that.settings.onCreate === "function") {

                // Pass in an empty object (sandbox) for the onCreate context.
                // We'll then check it for various properties once it's returned.
                sandbox = {};
                that.settings.onCreate.call(sandbox);

                if (sandbox.hasOwnProperty('items')) {
                    temp = that.getQueue('items') || [];
                    sandbox.items.forEach(function (item) {
                        temp.push(item);
                    });
                    that.enqueue('items', temp);
                }
            }

            // Initialize items.
            that.queue('items', function (item) {
                item.init(that.db.addTo('items', item.db.values), that);
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



    Vessel.static = {};

    /**
     * Allow a random number of templated items in a vessel template.
     * Also determine if the item should exist in the vessel, at random.
     */
    Vessel.static.mayContain = function (items) {
        var temp;

        temp = [];

        items.forEach(function (item, i) {
            var itemTemplate;

            // Is this item referencing a template?
            if (item.name.indexOf(">") === 0) {

                itemTemplate = Item.static.getTemplateValues(item.name);

                if (itemTemplate !== undefined) {
                    item = utils.merge.recursive(true, itemTemplate, item);
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
    };

    Vessel.static.template = function (name, options) {
        Vessel.static.templates[name] = options;
        return Vessel.static;
    };

    Vessel.static.templates = {};



    module.exports = Vessel;
}());
