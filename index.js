(function () {
    "use strict";

    var app,
        bodyParser,
        Database,
        database,
        environment,
        express,
        handlebars,
        http,
        mongoose,
        port,
        routes,
        server;

    http = require('http');
    routes = require('./server/routes');
    express = require('express');
    Database = require('./server/database');
    mongoose = require('mongoose');
    bodyParser = require('body-parser');
    handlebars  = require('express-handlebars');

    environment = process.env.NODE_ENV || 'development';
    port = process.env.PORT || 5000;

    database = new Database({
        uri: process.env.DATABASE_URI || '',
        service: mongoose
    });

    database.connect(function () {
        console.log("Database connected.");
    });

    database.startup(function () {
        console.log("Database documents created.");
    });

    app = express();

    app.engine('handlebars', handlebars({
        defaultLayout: 'main',
        layoutsDir: __dirname + '/server/views/layouts/'
    }));

    app.set('port', port);
    app.set('views', __dirname + '/server/views');
    app.set('view engine', 'handlebars');

    app.use(express.static('public/build/'));
    app.use(bodyParser.json());

    app.get('/', routes.index);
    app.get('/api/location', routes.api.getLocations);
    app.get('/api/location/:id', routes.api.getLocation);
    app.get('/api/location/:locationId/structure/:structureId', routes.api.getStructure);

    // Error Handling
    if (environment === "development") {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    server = http.createServer(app);
    server.listen(app.get('port'), function () {
        console.log('Node app is running on port', app.get('port'));
    });

}());