const {ipcRenderer} = require('electron');
const {games, IP} = require('./public/games.js');

const urlParams = new URLSearchParams(window.location.search);
const id = parseInt(urlParams.get('id'));
console.log(IP);
function registerStrokes(block, key) {
    window.addEventListener("keydown", (e) => {
        let char = e.key === ' ' ? 'SPACE' : e.key.toUpperCase();
        if (char === key) {
            block.classList.add("block-active");
        }
    });
    window.addEventListener("keyup", (e) => {
        let char = e.key === " " ? "SPACE" : e.key.toUpperCase();
        if (char === key) {
            block.classList.remove("block-active");
        }
    });
}

if (typeof id === "number") {
    window.addEventListener('load', () => {
    const title = document.getElementById('title');
    title.innerText = `Playing ${games[id].name}`;

    const quit = document.getElementById('quit');
    quit.addEventListener("click", () => {
        ipcRenderer.send('disconnect');
        window.location.assign("index.html")
    });

    const explanation = games[id].explanation;
        for (const i in explanation) {
            const item = explanation[i];

            const layout = document.createElement('div');
            layout.classList.add('layout');

            if (item.type === "grid") {
                for (const y in item.layout) {
                    const row = document.createElement("div");
                    row.classList.add("row");

                    for (const x in item.layout[y]) {
                        const block = document.createElement('div');
                        block.classList.add('block');

                        row.append(block);

                        if (!item.layout[y][x]) continue;
                        block.classList.add('block-filled');
                        block.innerText = item.layout[y][x];

                        registerStrokes(block, item.layout[y][x]);
                    }

                    layout.append(row);
                }
            } else if (item.type === "large") {
                const block = document.createElement('div');
                block.classList.add('block');
                block.classList.add('block-filled');
                block.classList.add('large');
                block.innerText = item.text;
                layout.append(block);

                registerStrokes(block, item.text);
            }

            document.body.querySelector(".layouts").append(layout);

            const description = document.createElement('div');
            description.classList.add('description');
            description.innerText = item.description;

            document.body.querySelector(".layouts").append(description);
        }


    });

    ipcRenderer.send("connect", {
        ip: IP,
        port: games[id].port
    })

    const list = games[id].keys;
    let old = {};
    const keys = {};
    for (const i in list) {
        keys[list[i]] = false;
    }
    send(list[0]);

    window.addEventListener("keydown", (e) => {
        if (typeof keys[e.key] === "undefined") return;

        keys[e.key] = true;
        send(e.key);
    });

    window.addEventListener("keyup", (e) => {
        if (typeof keys[e.key] === "undefined") return;

        keys[e.key] = false;
        send(e.key);
    });

    function current(key) {
        if (id === 0) {
            if (!keys[key]) return null;

            return key;
        }
        if (id === 1) {
            if (keys["w"] && keys["s"]) return "c";
            if (keys["w"]) return "w";
            if (keys["s"]) return "s";

            return "c";
        }
        if (id === 2 || id === 3) {
            let string = "";
            for (const key in keys) {
                if (keys[key]) string += "1";
                else string += "0";
            }

            return string;
        }
    }

    function send(key) {
        const curr = current(key);
        if (!curr) return;

        ipcRenderer.send("send", curr);
        old = {...keys};
    }
}