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

//Callback query handlers
const onShowInfoRequest = async (ctx, seriesId) => {
    const showInfo = await service.showItem(seriesId);

    if (!showInfo.error) {
        let formattedShowInfo = utils.prepareShowInfo(showInfo, seriesId);
        return ctx.answerCallbackQuery(formattedShowInfo);
    }

    return ctx.reply(`Couldn't fetch show info. Please try again`);
}


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

bot.on('callback_query', async ctx => {
    let updateData = JSON.parse(ctx.callbackQuery.data);
    const updateType = updateData.type;

    switch (updateType) {
        case 'info':
            onShowInfoRequest(ctx, updateData.id)
            break;
    
        default:
            break;
    }


    console.log('ctx cb query', ctx.callbackQuery);
	return ctx.reply(`test`);
});


module.exports = bot;
