const playerNotJoined = async (message) => {
  const exampleEmbed = {
    color: '0xede100',
    author: {
      name: 'Running Command',
    },
    fields: [
      {
        name: ':warning: Failed to Run Command',
        value: "Looks like you aren't playing. Use the **!join** command to join in!",
        inline: true,
      },
    ],
  }
  message.reply({ embeds: [exampleEmbed] })
}

module.exports = {
  playerNotJoined,
}
