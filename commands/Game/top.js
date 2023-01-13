const fs = require("fs");
const commaNumber = require("comma-number");

module.exports = {
  name: "top",
  description: "",
  aliases: ["t"],
  disabled: false,
  admin: false,
  execute: async (client, message, args) => {
    const data = JSON.parse(
      fs.readFileSync("./data/players.json", {
        encoding: "utf8",
        flag: "r",
      })
    );

    let players = data.players.sort((a, b) => b.coins - a.coins);
    let m = "**---- Top Players ----**";
    for (let i = 0; i < players.length; i++) {
      m += "\n" + players[i].id + " - :coin: " + players[i].coins.toFixed(2);
    }

    message.reply(m);
  },
};
