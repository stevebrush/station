(function () {
    'use strict';

    var routes;

    routes = {
        api: {},
        forge: {}
    };

    routes.index = function (req, res) {
        res.render('home', {
            module: 'station'
        });
    };

    routes.api = require(__dirname + '/api.js');

    module.exports = routes;
}());