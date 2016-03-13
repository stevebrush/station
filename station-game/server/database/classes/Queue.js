(function () {
    'use strict';

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
            var item,
                k;

            if (this.hasQueue(key)) {
                for (k in queue[key]) {
                    callback.call(queue[key], queue[key][k], k);
                }
            }
        };
    }

    module.exports = Queue;
}());