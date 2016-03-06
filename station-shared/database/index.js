(function () {
    'use strict';

    var locationModel,
        STATION;

    locationModel = require('./models/location');
    STATION = require("./classes/Station");

    function startup(callback) {
        var add,
            World;

        add = STATION.Factory;
        World = STATION.World;

        locationModel.collection.remove();

/*
        Location = require('./classes/Location');

        myLoc = new Location({
            name: "Lucky's Garage",
            structures: [
                {
                    name: "Repair Shop",
                    rooms: [
                        {
                            name: "Lobby",
                            vessels: [
                                {
                                    alias: "desk",
                                    items: [
                                        {
                                            alias: "pen"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: "Garage",
                            vessels: [
                                {
                                    alias: "toolbox",
                                    items: []
                                }
                            ]
                        },
                        {
                            name: "Manager's Office",
                            vessels: [
                                {
                                    name: "Wall Safe",
                                    items: []
                                }
                            ]
                        },
                        {
                            name: "Employee Restroom",
                            vessels: []
                        },
                        {
                            name: "Public Restroom",
                            vessels: []
                        }
                    ],
                    doors: {
                        'Lobby': ['Garage', 'Manager\'s Office', 'Public Restroom'],
                        'Garage': ['Employee Restroom']
                    },
                    entrance: {
                        name: 'Lobby'
                    }
                }
            ]
        });

        myLoc.save();
*/

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

        /*
         1. Make doors work
         2. Make sure every structure has an entrance
         3. Make it easier to move module functions around (structure, room, etc.)
         */
        /**
         Functions:
            location, structure, room, entrance, enemy, door, vessel, key
         */

        World
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
                        add.room("Offices").lock("luckys-garage|repair-shop|lobby|desk|hotel-key")
                    ])
                ])
            ])
            .init();

/*
        World
            .location("Lucky's Garage", {
                description: "Friendly outpost aside from the rats. Just needs a woman's touch.",
                structures: [
                    structure("Repair Shop", {
                        description: "Rusty walls and concrete columns. Windows are boarded up.",
                        rooms: [
                            room("Lobby", {
                                description: "Papers strewn on the floor. The smell of rat feeces fills the air.",
                                isEntrance: true,
                                doors: {
                                    n: 'garage'
                                },
                                vessels: [
                                    vessel(">toolbox", {
                                        items: [
                                            key("Hotel Key")
                                        ]
                                    })
                                ]
                            }),
                            room("Garage", {
                                doors: {
                                    s: 'lobby'
                                },
                                vessels: [
                                    vessel(">toolbox")
                                ]
                            })
                        ]
                    })
                ]
            });

        World
            .location("Charred Towers", {
                structures: [
                    structure("Hotel", {
                        rooms: [
                            room("Offices", {
                                items: [
                                    lock("luckys-garage|repair-shop|lobby|toolbox|hotel-key")
                                ]
                            })
                        ]
                    })
                ]
            });
*/


/*
        World
            .location("Lucky's Garage", {
                description: "Friendly outpost aside from the rats. Just needs a woman's touch."
            })
                .structure("Repair Shop", {
                    description: "Rusty walls and concrete columns. Windows are boarded up."
                })

                    .room("Lobby", {
                        description: "Papers strewn on the floor. The smell of rat feeces fills the air.",
                        isEntrance: true,
                        doors: {
                            n: 'garage'
                        }
                    })
                        .vessel(">toolbox")
                            .key("Hotel Key")

                    .room("Garage", {
                        doors: {
                            s: 'lobby'
                        }
                    })
                        .vessel(">toolbox");

        World
            .location("Charred Towers")
                .structure("Hotel")
                    .room("Offices")
                        .lock("luckys-garage|repair-shop|lobby|toolbox|hotel-key");
*/

        //World.build();
        //console.log(JSON.stringify(World.locations));

        /*

        var MyVessel1 = new World.Vessel(">toolbox", {});
        var MyVessel2 = new World.Vessel(">toolbox", {
            keyLookup:
        });
        MyVessel1.key("Office Key");
*/

        if (callback) {
            callback();
        }

/*
        // Create item templates.
        World
            .Item
            .template("wrench", {
                name: "Wrench",
                weight: 1,
                valueFactor: .3
            });

        // Create vessel templates.
        World
            .Vessel
            .template("toolbox", {
                name: "Toolbox",
                items: World.Item.mayAppear([
                    {
                        name: ">wrench"
                        quantity: World.Item.getRandomQuantity(2),
                        chance: 0.78
                    },
                    {
                        name: ">nails"
                        quantity: World.Item.getRandomQuantity(8),
                        chance: 0.9
                    },
                ])
            });

        // Now we can build environments with the prototypes.
        // (The less-than symbol designates a template.)
        World
            .location("Lucky's Garage")
                .structure("Repair Shop")
                    .room("Lobby")
                        .vessel(">toolbox")
                            .key("Office Key")
                .structure("Fueling Station")
                    .room("Fuel Pumps")
                        .vessel(">milk-crate")
                            .weapon(">pistol-lt-10") // Return a random pistol that is less than 10 level value.
                            .junk(">cigarettes", {
                                quantity: World.Item.getRandomQuantity(5)
                            });

        // These methods double-check our work. They will only alert us if something's broken.
        World.checkKeys();
        World.checkTemplates();
*/
    }

    function Database(options) {
        var service,
            uri;

        uri = options.uri;
        service = options.service;

        this.connect = function (callback) {
            service.connect(uri);
            service.connection.once('open', function () {
                startup(callback);
            });
        };

        return this;
    }

    Database.models = {
        Location: require('./models/location')
    };

    Database.schemas = {};

    module.exports = Database;
}());