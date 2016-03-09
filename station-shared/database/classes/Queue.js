(function () {
    'use strict';

    var utils;

    utils = require('../utils');

    function Queue() {
        var queue;

        queue = {};

        this.hasQueue = function (key) {
            return (queue.hasOwnProperty(key));
        };

        this.enqueue = function (key, arr) {
            queue[key] = arr;
        };

        this.getQueue = function (key) {
            return queue[key];
        };

        this.queue = function (key, callback) {
            var k;

            if (this.hasQueue(key)) {
                for (k in queue[key]) {
                    callback.call(this, queue[key][k]);
                }
            }
        };
    }

    module.exports = Queue;
}());