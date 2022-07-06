let IP = "100.64.0.65";
let COLOR = "#3495eb"
const VERSION = "1.2.1";
if (!localStorage.getItem("IP")) {
    localStorage.setItem("IP", IP);
} else {
    IP = localStorage.getItem("IP");
}
if (!localStorage.getItem("COLOR")) {
    localStorage.setItem("COLOR", COLOR);
} else {
    COLOR = localStorage.getItem("COLOR");
}
const games = require("./games.json");

module.exports = {
    IP,
    games,
    VERSION,
    COLOR
}