const { Client, GatewayIntentBits } = require('discord.js')
const prompts = require('./prompts/daily-prompts.js')
require('dotenv').config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

const getRandomPrompt = () => {
  const randomIdx = Math.floor(Math.random() * prompts.length)
  return prompts[randomIdx]
}

const sendPromptAndExit = async () => {
  try {
    const channelId = process.env.CHANNEL_ID

    if (!channelId) {
      console.error('CHANNEL_ID environment variable not set')
      process.exit(1)
    }

    const channel = await client.channels.fetch(channelId)
    if (!channel) {
      console.error(`Could not find channel with ID ${channelId}`)
      process.exit(1)
    }

    const botMember = channel.guild.members.cache.get(client.user.id);
    const permissions = channel.permissionsFor(botMember)
    if (!permissions.has('SendMessages')) {
      console.error('Bot does not have Send Messages permission in this channel');
      process.exit(1)
    }

    const prompt = getRandomPrompt()
    const embed = {
      color: 0x00AE86,
      title: prompt,
      description: 'Daily art prompt',
      timestamp: new Date(),
    }

    await channel.send({ embeds: [embed]})
    console.log(`Daily prompt sucessfully sent: ${prompt}`)
    process.exit(0)
  } catch (err) {
    console.error('Error sending prompt', err)
    console.error('Error code', err.code)
    console.error('Error message:', err.message)
    process.exit(1)
  }
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
  sendPromptAndExit();
})

client.login(process.env.DISCORD_TOKEN )