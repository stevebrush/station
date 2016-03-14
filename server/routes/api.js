(function () {

    var Api,
        Location;

    Api = {};
    Location = require('../database').models.Location;

    function onError(response, error) {
        response.status(500).json({
            error: error
        });
    }

    Api.getLocations = function (request, response) {
        Location.find({}).sort({ 'name': 'ascending' }).exec(function (error, docs) {
            if (error) {
               return onError(response, error);
            }
            response.status(200).json({
                locations: docs
            });
        });
    };

    Api.getLocation = function (request, response) {
        Location.findOne({
            _id: request.params.id
        }).exec(function (error, docs) {
            if (error) {
               return onError(response, error);
            }
            response.status(200).json({
                location: docs
            });
        });
    };

    Api.getStructure = function (request, response) {
        Location.findOne({
            _id: request.params.locationId
        }, function (error, doc) {
            return doc.structures.id(request.params.structureId);
        }).exec(function (error, doc) {
            if (error) {
               return onError(response, error);
            }
            response.status(200).json({
                structure: doc.structures[0]
            });
        });
    };

    module.exports = Api;

}());