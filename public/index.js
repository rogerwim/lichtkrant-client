const tiles = document.getElementById('tiles');
const footer = document.getElementById('footer');
const ip = document.getElementById('ip');
const btn = document.getElementById('btn');
const close = document.getElementById('close');
const settings = document.getElementById('settings');
const update = document.getElementById('update');
const updateClose = document.getElementById('updateClose');
btn.addEventListener("click", () => {
    settings.style.display = "flex";
})
close.addEventListener("click", () => {
    settings.style.display = "none";
})
ip.value = games.IP;

ip.addEventListener("input", () => {
    localStorage.setItem('IP', ip.value);
});

for (const i in games.games) {
    const game = games.games[i];

    const el = document.createElement('div');
    el.classList.add('tile');
    el.style.backgroundColor = game.color;

    const title = document.createElement('h1');
    title.classList.add('title');
    title.innerText = game.name;

    const description = document.createElement('p');
    description.innerText = game.description;

    el.append(title, description);
    el.addEventListener("click", () => {
        window.location.assign(`play.html?id=${i}`);
    });
    tiles.append(el);
}

footer.addEventListener("click", () => {
    window.location.assign('place.html');
});

const compareVersions = (v1Str, v2Str) => {
    const v1 = v1Str.replace(/^v/g, "").trim()
    const v2 = v2Str.replace(/^v/g, "").trim()
    if (v1 === v2) {
        return "even"
    }
    const [v1num, v1ext] = v1.split("-")
    const [v2num, v2ext] = v2.split("-")
    // Same number and at least one of them has a suffix such as "-dev"
    if (v1num === v2num) {
        if (v1ext && v2ext) {
            // Do a simple comparison of named pre releases
            const suffixMap = {"alpha": 2, "beta": 3, "dev": 1, "prerelease": 4}
            const v1suffix = suffixMap[v1ext] || 0
            const v2suffix = suffixMap[v2ext] || 0
            if (v1suffix > v2suffix) {
                return "newer"
            }
            if (v1suffix < v2suffix) {
                return "older"
            }
        } else if (v1ext) {
            return "older"
        } else if (v2ext) {
            return "newer"
        }
        return "even"
    }
    for (let i = 0; i < 3; i++) {
        if (Number(v1num.split(".")[i]) > Number(v2num.split(".")[i])) {
            return "newer"
        }
        if (Number(v1num.split(".")[i]) < Number(v2num.split(".")[i])) {
            return "older"
        }
    }
    return "unknown"
}
fetch("https://api.github.com/repos/djoamersfoort/lichtkrant-client/releases/latest")
    .then(res => res.json())
    .then(data => {
        if (compareVersions(games.VERSION, data.tag_name) === "older") {
            update.style.display = "flex";
            updateClose.addEventListener("click", () => {
                update.style.display = "none";
            });

            const link = document.createElement('a');
            link.href = data.html_url;
            link.innerText = "Download";
            update.querySelector(".settings").appendChild(link);
            link.target = "_blank";
        }
    })
