(function (angular) {
    'use strict';

    function CharacterFactory($interval, $q, $rootScope, $timeout, LogService, VesselFactory) {
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

            settings.backpack.name = settings.name;
            settings.backpack._id = settings._id;
            that.backpack = VesselFactory.make(settings.backpack);

            that.name = settings.name;

            that.attack = function (character) {
                var deferred;
                deferred = $q.defer();

                $timeout(function () {
                    var data;
                    data = {};

                    // Chance to hit target.
                    if (Math.random() > 0.15) {
                        data.health = character.takeDamage(settings.attributes.strength);
                        data.message = '-' + settings.attributes.strength;
                        LogService.addMessage(that.name + " attacks " + character.name + ". [-" + settings.attributes.strength + "]");
                        if (data.health <= 0) {
                            character.stopAttacking();
                            character.backpack.name = character.name + " Corpse";
                            character.isDead = true;
                        }
                        deferred.resolve(data);

                    } else {
                        data.health = character.getStatus('health');
                        data.message = 'miss';
                        LogService.addMessage(that.name + " misses " + character.name + ".");
                        deferred.resolve(data);
                    }

                    if (character.isPlayer()) {
                        $rootScope.$broadcast('player:attacked', data);
                    }

                }, 1500); // weapon dps

                return deferred.promise;
            };

            that.getAttribute = function (def) {
                return settings.attributes[def];
            };

            that.getAttributes = function () {
                return settings.attributes;
            };

            that.getStatus = function (def) {
                if (def) {
                    return settings.status[def];
                }
                return settings.status;
            };

            that.isPlayer = function () {
                return settings.isPlayer;
            };

            that.startAttacking = function (character, callback) {
                that.attack(character).then(callback);
                attacking = $interval(function () {
                    that.attack(character).then(callback);
                }, 1500); // dps
            };

            that.stopAttacking = function () {
                $interval.cancel(attacking);
            };

            that.takeDamage = function (val) {
                settings.status.health -= val;
                return settings.status.health;
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
        '$q',
        '$rootScope',
        '$timeout',
        'LogService',
        'VesselFactory'
    ];

    angular.module('station')
        .factory('CharacterFactory', CharacterFactory);

}(window.angular));
