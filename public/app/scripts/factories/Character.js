(function (angular) {
    'use strict';

    function CharacterFactory($interval, $rootScope, LogService, VesselFactory) {
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
            defaults = {};
            settings = angular.merge({}, defaults, options);

            that.backpack = VesselFactory.make(settings);
            that.name = settings.name;

            that.takeDamage = function (val) {
                settings.status.health -= val;
                if (settings.isPlayer) {
                    $rootScope.$broadcast('player:attacked');
                }
                return settings.status.health;
            };

            that.getAttributes = function () {
                return settings.attributes;
            };

            that.getAttribute = function (def) {
                return settings.attributes[def];
            };

            that.getStatus = function (def) {
                if (def) {
                    return settings.status[def];
                }
                return settings.status;
            };

            // Player attack value:
            that.getAttack = function () {};

            that.attack = function (character) {
                var health;
                if (Math.random() > 0.15) {
                    health = character.takeDamage(settings.attributes.strength);
                    LogService.addMessage(that.name + " attacks " + character.name + ". [-" + settings.attributes.strength + "]");
                    if (health <= 0) {
                        character.stopAttacking();
                        character.backpack.name = character.name + " Corpse";
                        character.isDead = true;
                    }
                } else {
                    health = character.getStatus('health');
                    LogService.addMessage(that.name + " misses " + character.name + ".");
                }
                return health;
            };

            // This method should never be run by player.
            that.startAttacking = function (character) {
                attacking = $interval(function () {
                    that.attack(character);
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
        '$rootScope',
        'LogService',
        'VesselFactory'
    ];

    angular.module('station')
        .factory('CharacterFactory', CharacterFactory);

}(window.angular));
