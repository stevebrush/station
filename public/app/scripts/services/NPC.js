(function (angular) {
    'use strict';

    function NPCService(Character) {
        var that;

        that = this;

        that.getNPCById = function (id) {
            return $http.get('/api/npc' + id).then(function (res) {
                return Character.make(res.data);
            });
        };

        return that;
    }

    NPCService.$inject = [
        'Character'
    ];

    angular.module('station')
        .service('NPCService', NPCService);
}(window.angular));
