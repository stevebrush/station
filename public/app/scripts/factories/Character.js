(function (angular) {
    'use strict';

    function CharacterFactory($interval, LogService, VesselFactory) {
        var characters,
            that;

        that = this;
        characters = {};

        function Character(options) {
            var attacking,
                defaults,
                settings,
                that;

            that = this;
            defaults = {
                status: {}
            };
            settings = angular.merge({}, defaults, options);
            console.log("Making character:", settings);
            that.backpack = VesselFactory.make(settings);
            that.name = settings.name;
            settings.status.health = settings.attributes.vitality;
            that.status = settings.status;
            that.attributes = settings.attributes;

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

            that.startAttacking = function (char) {
                attacking = $interval(function () {
                    if (Math.random() > 0.5) {
                        char.status.health--;
                        LogService.addMessage(that.name + " attacks " + char.name + ". [-1]");
                    } else {
                        LogService.addMessage(that.name + " misses " + char.name + ".");
                    }
                }, 1000);
            };

            that.stopAttacking = function () {
                $interval.cancel(attacking);
            };
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
        '$interval',
        'LogService',
        'VesselFactory'
    ];

    angular.module('station')
        .factory('CharacterFactory', CharacterFactory);

}(window.angular));
