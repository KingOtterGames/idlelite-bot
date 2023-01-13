const fs = require("fs");
const commaNumber = require("comma-number");
const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en");
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

module.exports = {
  name: "dice",
  description: "",
  aliases: [],
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
        function containsOnlyNumbers(str) {
          return /^\d+$/.test(str);
        }

        let bet = args[0];
        if (player.coins < bet) {
          message.reply("You can't afford that you broke fool!");
          return;
        }

        if (args.length !== 1) {
          message.reply("Please include your bet like so: `!dice 50`");
          return;
        } else if (!containsOnlyNumbers(args[0])) {
          message.reply("That is not a valid number...");
        }

        let playerRoll = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ];
        let computerRoll = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ];

        let playerTotal = playerRoll[0] + playerRoll[1];
        let computerTotal = computerRoll[0] + computerRoll[1];
        let total = 0;
        let outcomeText =
          "You have **DRAWN** and have recieved :coin: " + bet + " back.";

        if (playerTotal > computerTotal) {
          total = bet;
          outcomeText = "You have **WON** and gain :coin: " + bet + ".";
        } else if (playerTotal < computerTotal) {
          total = -bet;
          outcomeText = "You have **LOST** and lose :coin: " + bet + ".";
        }

        message.reply(
          "You roll :game_die: **" +
            playerRoll[0] +
            "** and :game_die: **" +
            playerRoll[1] +
            "**" +
            "\nThey roll :game_die: **" +
            computerRoll[0] +
            "** and :game_die: **" +
            computerRoll[1] +
            "**" +
            "\n\n" +
            outcomeText
        );

        data.players[i].coins =
          parseFloat(data.players[i].coins) + parseFloat(total);
        fs.writeFileSync("./data/players.json", JSON.stringify(data), {
          encoding: "utf8",
          mode: 0o666,
        });

        return;
      }
    }
  },
};
