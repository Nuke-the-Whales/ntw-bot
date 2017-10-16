const dotenv = require("dotenv");
const { Composer, Extra } = require('micro-bot');
const Telegraf = require('telegraf');
const { reply } = Telegraf;

const utils = require('./utils');
const service = require('./service');

dotenv.load();

const bot = new Composer;

bot.command('/oldschool', (ctx) => ctx.reply('Hello'));
bot.command('/modern', ({ reply }) => reply('Yo'));
bot.command('/hipster', reply('λ'));

bot.hears('hi', (ctx) => ctx.reply('Hey there!'));
bot.on('sticker', (ctx) => ctx.reply('👍'));

//Search via inline query (@NukeTheWhalesBot ...)
bot.on('inline_query', async ctx => {
    let searchText = ctx.update.inline_query.query;
    if (searchText.length > 3) {
        let seriesList = await service.searchSeries(searchText);

        if (!seriesList.error) {
            let formattedSeriesList = utils.prepareSeriesList(seriesList);
            return ctx.answerInlineQuery(formattedSeriesList, {cache_time: 0});
        }

        return ctx.answerInlineQuery(utils.errorMsg, {switch_pm_text: 'try some of other commands'});
    }
});

//Send show info after user selects inline query result
bot.on('chosen_inline_result', async ctx => {
    console.log('chosen inline result', ctx.update.chosen_inline_result);
	let {from: user, result_id: seriesId} = ctx.update.chosen_inline_result;
	let showInfo = await service.showItem(seriesId);

	if (!showInfo.error) {
	    let formattedShowInfo = utils.prepareShowInfo(showInfo);
	    return ctx.replyWithPhoto(formattedShowInfo);
    }

	return ctx.reply(`Couldn't retrieve detailed show info. Please try again later`);
});

//Subscribe user to tv series
bot.on('callback_query', async ctx => {
    console.log('ctx', ctx);
	return ctx.reply(`test`);
});


module.exports = bot;
