const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

// Get bot token and channel ID from environment variables (secure method)
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

// Art prompts list - edit this array to add/remove prompts
const ART_PROMPTS = [
    "A cat wearing a wizard hat",
    "Sunset over mountains",
    "A robot gardening",
    "Ancient tree with glowing leaves",
    "Cozy coffee shop in the rain",
    "Dragon sleeping on treasure",
    "Floating islands in the sky",
    "A fox reading a book",
    "Enchanted forest pathway",
    "Steampunk airship",
    "Ocean waves at night",
    "A house made of mushrooms",
    "Butterfly landing on a flower",
    "Medieval castle on a cliff",
    "A dog astronaut in space",
    "Magical potion brewing",
    "City skyline at dawn",
    "A phoenix rising from ashes",
    "Underwater coral garden",
    "A bear wearing a scarf",
    "Crystal cave with gems",
    "Hot air balloon festival",
    "A owl perched on books",
    "Snowy cabin in woods",
    "A mermaid sitting on rocks",
    "Desert oasis with palm trees",
    "A unicorn in a meadow",
    "Rainy day window view",
    "A knight's armor on display",
    "Fairy house in a flower"
];

// Create Discord client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// Function to get random prompt
function getRandomPrompt() {
    const randomIndex = Math.floor(Math.random() * ART_PROMPTS.length);
    return ART_PROMPTS[randomIndex];
}

// Function to post daily prompt
async function postDailyPrompt() {
    try {
        const channel = await client.channels.fetch(CHANNEL_ID);
        if (channel) {
            const prompt = getRandomPrompt();
            const message = `🎨 **Daily Art Prompt** 🎨\n\n**"${prompt}"**\n\nGrab your art supplies and let your creativity flow! Share your artwork when you're done! ✨`;
            await channel.send(message);
            console.log(`Posted daily prompt: ${prompt}`);
        }
    } catch (error) {
        console.error('Error posting daily prompt:', error);
    }
}

// Bot ready event
client.once('ready', () => {
    console.log(`Bot is ready! Logged in as ${client.user.tag}`);
    console.log('Daily prompts will be posted at 7:00 AM PST');
});

// Schedule daily prompt at 7:00 AM PST (15:00 UTC, adjust if needed)
// Note: This runs at 7 AM PST (3 PM UTC). During daylight saving time, PST becomes PDT (UTC-7), so adjust accordingly
cron.schedule('0 15 * * *', () => {
    console.log('Time to post daily art prompt!');
    postDailyPrompt();
}, {
    timezone: "America/Los_Angeles"
});

// Optional: Command to manually trigger a prompt (type !prompt in Discord)
client.on('messageCreate', async (message) => {
    if (message.content === '!prompt' && !message.author.bot) {
        const prompt = getRandomPrompt();
        const response = `🎨 **Random Art Prompt** 🎨\n\n**"${prompt}"**\n\nHappy drawing! ✨`;
        await message.reply(response);
    }
});

// Login to Discord
client.login(BOT_TOKEN);