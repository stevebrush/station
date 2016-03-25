(function (angular) {
    'use strict';

    function EnemyService(Character) {
        var that;

        that = this;

        that.getEnemyById = function (id) {
            return $http.get('/api/enemy' + id).then(function (res) {
                return Character.make(res.data);
            });
        };

        return that;
    }

    EnemyService.$inject = [
        'Character'
    ];

    angular.module('station')
        .service('EnemyService', EnemyService);
}(window.angular));
