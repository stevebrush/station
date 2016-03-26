(function (angular) {
    'use strict';

    function CharacterFactory(VesselFactory) {
        var characters,
            that;

        that = this;
        characters = {};

        function Character(options) {
            var defaults,
                settings,
                that;

            that = this;
            defaults = {};
            settings = angular.merge({}, defaults, options);
            that.backpack = VesselFactory.make(settings.backpack);

            // Player attributes (SPECIAL):
            that.getAttributes = function () {};

            // Player status (health, stamina, poison, loadMaximum):
            that.getStatus = function () {};

            // Player attack value:
            that.getAttack = function () {};
        }

        that.getById = function (id) {
            return characters[id];
        };

        that.make = function (data) {
            var character;
            character = characters[data._id];
            if (character) {
                console.log("Character already exists! Yay!");
                character.backpack.updateStats();
                return character;
            }
            console.log("Create player with:", data);
            data.backpack = data.backpack || {};
            character = characters[data._id || 'player'] = new Character(data);
            character.backpack.updateStats();
            return character;
        };

        return that;
    }

    CharacterFactory.$inject = [
        'VesselFactory'
    ];

    angular.module('station')
        .factory('CharacterFactory', CharacterFactory);

}(window.angular));
