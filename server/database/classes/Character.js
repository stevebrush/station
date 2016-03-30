(function () {
    "use strict";

    var DatabaseObject,
        DatabaseTemplate,
        CharacterTemplate,
        utils;


    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');
    DatabaseTemplate = require(__dirname + '/DatabaseTemplate');
    CharacterTemplate = require('../models/character-template');


    function Character(options) {
        var that;

        DatabaseObject.call(this, options);
        DatabaseTemplate.call(this, {
            template: CharacterTemplate
        });

        that = this;

        that.ready(function () {});
    }


    utils.mixin(Character, DatabaseObject);
    utils.mixin(Character, DatabaseTemplate);


    module.exports = Character;
}());
