const dotenv = require("dotenv");
dotenv.load();

const Telegraf = require('telegraf');
const { reply } = Telegraf;

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.command('/oldschool', (ctx) => ctx.reply('Hello'));
bot.command('/modern', ({ reply }) => reply('Yo'));
bot.command('/hipster', reply('λ'));

bot.hears('hi', (ctx) => ctx.reply('Hey there!'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.startPolling();