(function () {
    'use strict';

    var add,
        Database,
        World;

    add = require('./classes/Factory');
    Database = require('./classes/Database');
    World = require('./classes/World');

    function startup(callback) {
        var Station;

        // Clear the database documents before we begin.
        Database.models.Location.collection.remove();

        // Item templates.
        World
            .Item
                .template("ballpoint-pen", {
                    name: "Ballpoint Pen"
                })
                .template("wrench", {
                    name: "Wrench"
                })
                .template("nails", {
                    name: "Nails"
                });

        // Vessel templates.
        World
            .Vessel
                .template("desk", {
                    name: "Desk",
                    items: [],
                    onCreate: function () {
                        this.items = World.Vessel.mayContain([
                            {
                                name: ">ballpoint-pen",
                                quantity: World.Item.getRandomQuantity(1),
                                chance: 0.78
                            }
                        ]);
                    }
                })
                .template("toolbox", {
                    name: "Toolbox",
                    items: [],
                    onCreate: function () {
                        this.items = World.Vessel.mayContain([
                            {
                                name: ">wrench",
                                quantity: World.Item.getRandomQuantity(2),
                                chance: 0.78
                            },
                            {
                                name: ">nails",
                                quantity: World.Item.getRandomQuantity(8),
                                chance: 0.9
                            }
                        ]);
                    }
                });

        // Create the world!
        Station = new World();
        Station
            .locations([
                add.location("Lucky's Garage", "Friendly outpost aside from the rats. Just needs a woman's touch.").structures([
                    add.structure("Repair Shop", "Rusty walls and concrete columns. Windows are boarded up.").rooms([

                        add.entrance("Lobby", "Papers strewn on the floor. The smell of rat feeces fills the air.").vessels([
                            add.vessel(">desk").items([
                                add.key("Hotel Key")
                            ])
                        ]).doors([
                            add.door("s", "garage")
                        ]),

                        add.room("Garage", "Empty except for a tireless car.").vessels([
                            add.vessel(">toolbox")
                        ]).doors([
                            add.door("n", "lobby")
                        ])
                    ])
                ]),
                add.location("Charred Towers").structures([
                    add.structure("Hotel").rooms([
                        add.entrance("Offices").lock("luckys-garage|repair-shop|lobby|desk|hotel-key")
                    ])
                ])
            ])
            .init(function () {
                if (callback) {
                    callback();
                }
            });
    }

    module.exports = startup;

}());