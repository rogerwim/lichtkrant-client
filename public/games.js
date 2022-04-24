let IP = "100.64.0.65";
const VERSION = "1.0.0";
if (!localStorage.getItem("IP")) {
    localStorage.setItem("IP", IP);
} else {
    IP = localStorage.getItem("IP");
}
const games = [
    {
        "name": "Snake",
        "description": "Online snake game for lichtkrant",
        "color": "#457045",
        "port": 1029,
        "keys": ["w", "a", "s", "d"],
        "explanation": [
            {
                "type": "grid",
                "layout": [
                    [null, "W", null],
                    ["A", null, "D"],
                    [null, "S", null]
                ],
                "description": "Movement keys"
            }
        ]
    },
    {
        "name": "Pong",
        "description": "Online multiplayer pong game for lichtkrant",
        "color": "#303039",
        "port": 9999,
        "keys": ["w", "s"],
        "explanation": [
            {
                "type": "grid",
                "layout": [
                    [null, "W", null],
                    [null, "S", null]
                ],
                "description": "Movement keys"
            }
        ]
    },
    {
        "name": "Tetris",
        "description": "Online multiplayer tetris game for lichtkrant",
        "color": "#242873",
        "port": 7777,
        "keys": ["w", "a", "s", "d", "e", " "],
        "explanation": [
            {
                "type": "grid",
                "layout": [
                    [null, "W", null],
                    ["A", null, "D"],
                    [null, "S", null]
                ],
                "description": "Movement keys"
            },
            {
                type: "grid",
                layout: [
                    ["E"]
                ],
                description: "Rotate"
            },
            {
                type: "large",
                text: "SPACE",
                description: "Skip to bottom & ready up"
            }
        ]

    },
    {
        "name": "Splash",
        "description": "N&M Games splash for lichtkrant",
        "color": "#1e7ad5",
        "port": 42069,
        "keys": ["a", "d", "w"],
        "explanation": [
            {
                "type": "grid",
                "layout": [
                    [null, "W", null],
                    ["A", null, "D"],
                ],
                "description": "Movement keys"
            }
        ]
    }
]

module.exports = {
    IP,
    games,
    VERSION
}