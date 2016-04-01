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

        DatabaseTemplate.call(this, options);
        DatabaseObject.call(this, options);

        that = this;
        that.ready(function () {});
    }


    utils.mixin(Character, DatabaseObject);
    utils.mixin(Character, DatabaseTemplate);

    Character.static.templateModel = CharacterTemplate;

    module.exports = Character;
}());
