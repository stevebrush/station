(function () {
    'use strict';

    var Factory,
        World;

    Factory = require(__dirname + '/Factory');
    World = require(__dirname + '/World');

    module.exports = {
        Factory: Factory,
        World: new World()
    };
}());
