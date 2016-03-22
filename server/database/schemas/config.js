(function () {
    'use strict';

    var mongoose,
        Schema;

    mongoose = require('mongoose');
    Schema = mongoose.Schema;

    module.exports = new Schema({
        moneyId: {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        }
    }, {
        collection: 'Config'
    });
}());
