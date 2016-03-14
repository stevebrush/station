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
                .template("safe", {
                    name: "Safe",
                    items: [],
                    onCreate: function () {}
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

                // Lucky's Garage
                add.location("Lucky's Garage", "Friendly outpost aside from the rats. Just needs a woman's touch.").structures([
                    add.structure("Repair Shop", "Rusty walls and concrete columns. Windows are boarded up.").floors([
                        add.floor().rooms([

                            // Lobby
                            add.room("Waiting Room", "Papers strewn on the floor. The smell of rat feces fills the air.").vessels([
                                add.vessel(">desk").items([
                                    add.key("Hotel Key")
                                ])
                            ]).doors([
                                add.door("s", "garage"),
                                add.door("e", "bathrooms")
                            ]),

                            // Garage
                            add.room("Garage", "Empty except for a tireless car.").vessels([
                                add.vessel(">toolbox")
                            ]).doors([
                                add.door("n", "waiting-room")
                            ]),

                            // Bathroom
                            add.room("Bathrooms", "Pitted and broken wall tiles covered in gunk.").doors([
                                add.door("w", "waiting-room")
                            ])

                        ])
                    ]).entrances([
                        add.entrance("waiting-room", "floor-1")
                    ])
                ]),

                // Waypoint Station
                add.location("Waypoint Station", "A relatively inconsequential collection of shacks and broken buildings.").structures([
                    add.structure("Brighton Inn", "Fresh coat of paint on a crumbling exterior. Not a soul to be seen.").floors([
                        add.floor().rooms([

                            // Lobby
                            add.room("Lobby", "Dimly lit with a drifting ceiling of smoke.").doors([
                                add.door("n", "managers-office").lock("luckys-garage|repair-shop|floor-1|waiting-room|desk|hotel-key")
                            ]),

                            // Manager's Office
                            add.room("Manager's Office", "Nothing but a busted safe and what looks like an abandoned sleeping bag.").doors([
                                add.door("s", "lobby")
                            ]).vessels([
                                add.vessel(">safe")
                            ])

                        ])
                    ]).entrances([
                        add.entrance("lobby")
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