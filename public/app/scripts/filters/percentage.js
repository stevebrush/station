(function (window, angular) {
    "use strict";

    function filterPercentage($filter) {
        return function (input, decimals) {
            if (decimals === undefined) {
                decimals = 0;
            }
            return $filter('number')(input * 100, decimals) + '%';
        };
    }

    filterPercentage.$inject = [
        '$filter'
    ];

    angular.module('station')
        .filter('percentage', filterPercentage);

}(window, window.angular));