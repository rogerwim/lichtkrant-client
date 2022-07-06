const { ipcRenderer, contextBridge } = require('electron');
const { games, IP, COLOR, VERSION } = require('./games.js');
contextBridge.exposeInMainWorld("games", { games, IP, COLOR, VERSION });

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
        const label = document.getElementById('label');
        const picker = document.getElementById('colorInput');

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

            if (games[id].colors.visible) {
                label.style.display = "block";
            }
            if (!games[id].colors.configurable) {
                picker.setAttribute("disabled", "ture");
            }

            function setColor(code) {
                console.log(code);
                picker.value = code;
                label.style.backgroundColor = code;
                if (games[id].colors.configurable) ipcRenderer.send('send', code);
            }
            picker.addEventListener("change", () => {
                console.log(picker.value);
                setColor(picker.value);
                localStorage.setItem("COLOR", picker.value);
            });
            setColor(COLOR);
            ipcRenderer.on("data", (event, data) => {
                if (data.length !== 7 || !data.startsWith("#")) return;
                setColor(data);
            });
    });

    ipcRenderer.send("connect", {
        ip: IP,
        port: games[id].port
    })

    const list = games[id].keys;
    const keys = {};
    for (const i in list) {
        keys[list[i]] = false;
    }
    send(list[0]);

    window.addEventListener("keydown", (e) => {
        if (typeof keys[e.key] === "undefined") return;

        keys[e.key] = true;
        send();
    });

    window.addEventListener("keyup", (e) => {
        if (typeof keys[e.key] === "undefined") return;

        keys[e.key] = false;
        send();
    });

    function current() {
        let string = "";
        for (const key in keys) {
            if (keys[key]) string += "1";
            else string += "0";
        }
        if (games[id].colors.configurable) {
            while (string.length < 7) string += " ";
        }

        return string;
    }

    function send() {
        const curr = current();
        if (!curr) return;

        ipcRenderer.send("send", curr);
    }
}