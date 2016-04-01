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
            that.getAttributes = function () {
                return settings.attributes;
            };

            // Player status (health, stamina, poison):
            that.getStatus = function () {
                return settings.status;
            };

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
                character.backpack.updateStats();
                return character;
            }
            data.backpack = data.backpack || {};
            character = characters[data._id || 'Player'] = new Character(data);
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
