const colors = {
  red: 'fc2803',
  green: '04c904',
  blue: '3452eb',
  yellow: 'fcba03',
  purple: '9c34eb',
  pink: 'eb34c6',
  orange: 'eb6b34',
  teal: '2ee8dc',
}

const log = async (message, title, name, description, color) => {
  message.reply({
    embeds: [
      {
        color: '0x' + colors[color],
        author: {
          name: title,
        },
        fields: [
          {
            name: name,
            value: description,
            inline: true,
          },
        ],
      },
    ],
  })
}

const error = async (message, description) => {
  const exampleEmbed = {
    color: '0x' + colors['yellow'],
    author: {
      name: 'Failed Command',
    },
    fields: [
      {
        name: ':warning: Failed to run command',
        value: description,
        inline: true,
      },
    ],
  }
  message.reply({ embeds: [exampleEmbed] })
}

module.exports = {
  log,
  error,
}
