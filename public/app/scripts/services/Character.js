(function (angular) {
    'use strict';

    function CharacterService($http, $q, CharacterFactory) {
        var player,
            that;

        that = this;

        that.getPlayer = function () {
            var deferred;
            deferred = $q.defer();
            if (player) {
                player.backpack.updateStats();
                deferred.resolve(player);
            } else {
                $http.get('/data/player.json').then(function (res) {
                    player = CharacterFactory.make(res.data);
                    deferred.resolve(player);
                });
            }
            return deferred.promise;
        };
    }

    CharacterService.$inject = [
        '$http',
        '$q',
        'CharacterFactory'
    ];

    angular.module('station')
        .service('CharacterService', CharacterService);
}(window.angular));
