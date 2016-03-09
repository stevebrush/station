(function () {
    'use strict';

    var Database;

    Database = require(__dirname + '/database/classes/Database');

    module.exports = {
        Database: Database
    };
}());