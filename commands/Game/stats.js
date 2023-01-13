const fs = require("fs");
const commaNumber = require("comma-number");
const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en");
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

module.exports = {
  name: "stats",
  description: "",
  aliases: ["s"],
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
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === message.author.id) {
        let player = players[i];
        let now = new Date();
        let timeLapsed = (now - new Date(player.lastCheck)) / 1000;
        let lastCheck = data.players[i].lastCheck;

        let addedCoins = timeLapsed * player.basePerSecond * (player.boost + 1);
        data.players[i].coins += addedCoins;
        data.players[i].lastCheck = new Date();

        fs.writeFileSync("./data/players.json", JSON.stringify(data), {
          encoding: "utf8",
          mode: 0o666,
        });

        let base = 100;
        let count = data.players[i].boost + 1;
        let rate = 2.75;
        let boostCost = (base * count ** rate).toFixed(2);

        message.reply(
          ":coin: " +
            commaNumber(data.players[i].coins.toFixed(2)) +
            "         " +
            ":arrow_double_up: x" +
            data.players[i].boost +
            "         " +
            ":alarm_clock: " +
            commaNumber(
              (player.basePerSecond * (player.boost + 1) * 60 * 60).toFixed(2)
            ) +
            " / hr" +
            // "         " +
            // ":recycle: 0" +
            // "         " +
            // ":gem: " +
            // data.players[i].gems +
            "\n\n**Next :arrow_double_up: cost :coin: " +
            commaNumber(boostCost) +
            "**\n*Last check: " +
            timeAgo.format(new Date(lastCheck), "round") +
            "*"
        );
        return;
      }
    }

    message.reply(
      "Looks like you aren't playing. Use the **!join** command to join in!"
    );
  },
};
