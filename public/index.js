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
ip.value = IP;

ip.addEventListener("input", () => {
    IP = ip.value;
    localStorage.setItem('IP', IP);
});

for (const i in games) {
    const game = games[i];

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


fetch("https://api.github.com/repos/djoamersfoort/lichtkrant-client/releases/latest")
    .then(res => res.json())
    .then(data => {
        if (VERSION !== data.tag_name) {
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
