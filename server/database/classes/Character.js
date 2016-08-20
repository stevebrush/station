(function () {
    "use strict";

    var DatabaseObject,
        DatabaseTemplate,
        CharacterTemplate,
        Queue,
        utils;

    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');
    DatabaseTemplate = require(__dirname + '/DatabaseTemplate');
    CharacterTemplate = require('../models/character-template');
    Queue = require(__dirname + '/Queue');

    function Character(options) {
        var that;

        DatabaseTemplate.call(this, options);
        DatabaseObject.call(this, options);
        Queue.call(this);

        that = this;
        that.ready(function () {
            var sandbox,
                temp;

            that.db.document().status.health = that.settings.attributes.vitality;

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
                var instance;
                that.db.document().backpack.items.push(item.db.values);
                instance = utils.lastItem(that.db.document().backpack.items);
                item.init(instance, that);
            });

            return that;
        });
    }

    utils.mixin(Character, DatabaseObject);
    utils.mixin(Character, DatabaseTemplate);
    utils.mixin(Character, Queue);

    Character.prototype.items = function (items) {
        this.enqueue('items', items);
        return this;
    };

    Character.static.templateModel = CharacterTemplate;

    module.exports = Character;
}());
