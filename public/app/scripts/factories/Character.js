(function (angular) {
    'use strict';


    function Backpack(options) {
        var defaults,
            items,
            settings;

        defaults = {};
        items = [];
        settings = angular.merge({}, defaults, options);

        that.addItem = function (item) {
            items.push(item);
        };
    }


    function Character(options) {
        var defaults,
            settings;

        defaults = {};
        settings = angular.merge({}, defaults, options);
        that.backpack = new Backpack(settings.backpack);
    }


    function CharacterFactory() {
        var characters,
            that;

        that = this;
        characters = {};

        that.getById = function (id) {
            return characters[id];
        };

        that.make = function (data) {
            var character;
            character = characters[data._id];
            if (character) {
                return character;
            }
            character = characters[data._id || 'player'] = new Character(data);
            return character;
        };

        return that;
    }

    angular.module('station')
        .factory('Character', CharacterFactory);
}(window.angular));
