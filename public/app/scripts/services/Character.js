(function (angular) {
    'use strict';

    function CharacterService($http, $q, Character) {
        var player,
            that;

        that = this;

        that.getPlayer = function () {
            var deferred;
            deferred = $q.defer();
            if (player) {
                deferred.resolve(player);
            } else {
                $http.get('/api/player').then(function (res) {
                    player = Character.make(res.data);
                    deferred.resolve(player);
                });
            }
            return deferred.promise;
        };
    }

    CharacterService.$inject = [
        '$http',
        '$q',
        'Character'
    ];

    angular.module('station')
        .service('CharacterService', CharacterService);
}(window.angular));
