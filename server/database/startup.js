/*jshint node:true */
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
                .template("gold-flecks", {
                    name: "Gold Flecks"
                })
                .template("notebook-paper", {
                    name: "Notebook Paper"
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
                                chance: 0.65
                            },
                            {
                                name: ">notebook-paper",
                                quantity: World.Item.getRandomQuantity(3),
                                chance: 0.79
                            }
                        ]);
                    }
                })
                .template("trash-can", {
                    name: "Trash Can",
                    items: [],
                    onCreate: function () {
                        this.items = World.Vessel.mayContain([
                            {
                                name: ">notebook-paper",
                                quantity: World.Item.getRandomQuantity(3),
                                chance: 0.99
                            }
                        ]);
                    }
                })
                .template("cash-register", {
                    name: "Cash Register",
                    items: [],
                    onCreate: function () {
                        this.items = World.Vessel.mayContain([
                            {
                                name: ">gold-flecks",
                                quantity: World.Item.getRandomQuantity(50),
                                chance: 0.99
                            }
                        ]);
                    }
                })
                .template("safe", {
                    name: "Safe",
                    items: [],
                    onCreate: function () {
                        this.items = World.Vessel.mayContain([
                            {
                                name: ">gold-flecks",
                                quantity: World.Item.getRandomQuantity(20),
                                chance: 0.87
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
                                add.door("n", "waiting-room"),
                                add.ramp("w", "roof")
                            ]),

                            // Bathroom
                            add.room("Bathrooms", "Pitted and broken wall tiles covered in gunk.").doors([
                                add.door("w", "waiting-room"),
                                add.ramp("s", "attic"),
                                add.door("e", "cavity")
                            ]),

                            // Cavity
                            add.room("Cavity", "asdf").doors([
                                add.door("w", "bathrooms")
                            ])

                        ]),
                        add.floor().rooms([
                            add.room("Attic", "Dusty chests full of opera clothing.").doors([
                                add.ramp("n", "bathrooms")
                            ]),
                            add.room("Roof", "Eh?").doors([
                                add.ramp("e", "garage")
                            ])
                        ])
                    ]).entrances([
                        add.entrance("waiting-room", "floor-1")
                    ]),

                    // Utility Shed
                    add.structure("Utility Shed", "Leans to the side. Subtle smell of rust.").floors([
                        add.floor().rooms([
                            add.room("Simple Room", "Rusty and broken tools litter the far corner. Dead rats surround a drain pipe.").vessels([
                                add.vessel(">toolbox")
                            ])
                        ])
                    ]).entrances([
                        add.entrance("simple-room")
                    ])
                ]),

                // Waypoint Station
                add.location("Waypoint Station", "A relatively inconsequential collection of shacks and broken buildings.").structures([

                    // Olivia's Salty Shop
                    add.structure("Olivia's Salty Shop", "Unbecoming storefront except for a poorly-lit sign that reads, \"Y'all'r welcome.\"").floors([
                        add.floor().rooms([
                            add.room("Main Room", "A few shelves littered with trash. Must be the wares.").vessels([
                                add.vessel(">cash-register")
                            ]).doors([
                                add.door("n", "public-restroom")
                            ]),

                            add.room("Public Restroom", "Floors and walls immaculately cleaned. Stark contrast to other rooms.").vessels([
                                add.vessel(">trash-can")
                            ]).doors([
                                add.door("s", "main-room")
                            ])
                        ])
                    ]).entrances([
                        add.entrance("main-room")
                    ]),

                    // Police Headquarters
                    add.structure("Police Headquarters", "A lone man leans against the wall near the door. Must be the sheriff.").floors([
                        add.floor().rooms([
                            add.room("Waiting Room", "Cheap chairs in a row next to the wall. Picture of a random group of people framed in black-painted wood.").vessels([
                                add.vessel(">trash-can")
                            ])
                        ])
                    ]).entrances([
                        add.entrance("waiting-room")
                    ]),

                    // Brighton Inn
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
                                add.vessel(">safe"),
                                add.vessel(">trash-can")
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
