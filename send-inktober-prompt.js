const { Client, GatewayIntentBits } = require('discord.js')
const inktoberPrompts = require('./prompts/inktober-2025-prompts')
require('dotenv').config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

function getTodaysInktoberPrompt() {
  const today = new Date()
  const dayOfMonth = today.getDate()
  if (today.getMonth() !== 9) {
    throw new Error('Inktober prompts are only available in October')
  }
  if (dayOfMonth < 1 || dayOfMonth > 31) {
    throw new Error('Invalid day of month')
  }
  return {
    day: dayOfMonth,
    prompt: inktoberPrompts[dayOfMonth - 1],
  }
}

// Function to send the Inktober prompt and exit
async function sendInktoberPromptAndExit() {
  try {
    const channelId = process.env.CHANNEL_ID
    if (!channelId) {
      console.error(
        'CHANNEL_ID environment variable is not set'
      )
      process.exit(1)
    }

    console.log('Attempting to fetch channel with ID:', channelId)
    const channel = await client.channels.fetch(channelId)
    if (!channel) {
      console.error('Could not find channel with ID:', channelId)
      process.exit(1)
    }

    const { day, prompt } = getTodaysInktoberPrompt()
    const embed = {
      color: 0x2f3136, // Dark theme color for Inktober
      title: `🖋️ Inktober ${new Date().getFullYear()} - Day ${day}`,
      description: `**${prompt}**`,
      fields: [
        {
          name: "✨ Today's Challenge",
          value: `Create an ink drawing inspired by "${prompt}"`,
          inline: false,
        },
        {
          name: '📝 Tips',
          value:
            '• Use any ink-based medium\n• Share your creation with #inktober2025\n• Tag @jakeparker for a chance to be featured',
          inline: false,
        },
      ],
      footer: {
        text: 'Inktober - 31 days, 31 drawings, 31 prompts',
      },
      timestamp: new Date(),
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop&crop=center',
      },
    }
    console.log('Attempting to send Inktober embed message...')
    await channel.send({ embeds: [embed] })
    console.log(`✅ Inktober Day ${day} prompt sent successfully: ${prompt}`)
    process.exit(0)
  } catch (error) {
    console.error('Error sending Inktober prompt:')
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    // If we're not in October, send a friendly message
    if (error.message.includes('only available in October')) {
      console.log('ℹ️ Inktober prompts are only sent during October')
      process.exit(0)
    }
    console.error('Full error:', error)
    process.exit(1)
  }
}

// Bot ready event
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}! Sending Inktober prompt...`)
  sendInktoberPromptAndExit()
})

// Login to Discord
client.login(process.env.DISCORD_TOKEN)
