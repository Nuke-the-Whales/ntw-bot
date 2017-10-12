const dotenv = require("dotenv");
const { Composer, Extra } = require('micro-bot');
const Telegraf = require('telegraf');
const { reply } = Telegraf;

dotenv.load();

const bot = new Composer;

bot.command('/oldschool', (ctx) => ctx.reply('Hello'));
bot.command('/modern', ({ reply }) => reply('Yo'));
bot.command('/hipster', reply('λ'));

bot.hears('hi', (ctx) => ctx.reply('Hey there!'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
module.exports = bot;
