const fs = require("fs");

module.exports = {
  name: "join",
  description: "",
  aliases: ["j"],
  disabled: false,
  admin: false,
  execute: async (client, message, args) => {
    const data = JSON.parse(
      fs.readFileSync("./data/players.json", {
        encoding: "utf8",
        flag: "r",
      })
    );

    let players = data.players;
    let player;
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === message.author.id) {
        message.reply("Looks like you've already joined the game, silly!");
        return;
      }
    }

    data.players.push({
      id: message.author.id,
      name: message.author.displayName,
      coins: 0.0,
      gems: 0,
      boost: 0.0,
      lastCheck: new Date(),
      basePerSecond: 0.1,
    });

    fs.writeFileSync("./data/players.json", JSON.stringify(data), {
      encoding: "utf8",
      mode: 0o666,
    });

    message.reply("You have joined in on Idle Lite!");
  },
};
