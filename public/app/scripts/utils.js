(function (angular) {
    'use strict';

    function cleanArray(arr) {
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i] === undefined) {
                arr.splice(i, 1);
                i--;
            }
        }
        return arr;
    }

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function utils() {
        return {
            cleanArray: cleanArray,
            clone: clone
        };
    }

    angular.module('station')
        .service('utils', utils);
}(window.angular));
