const dotenv = require("dotenv");
const { Composer, Extra } = require('micro-bot');
const Telegraf = require('telegraf');
const { reply } = Telegraf;

const utils = require('./utils');
const service = require('./service');

dotenv.load();

const bot = new Composer();

bot.command('/oldschool', (ctx) => ctx.reply('Hello'));
bot.command('/modern', ({ reply }) => reply('Yo'));
bot.command('/hipster', reply('λ'));

bot.hears('hi', (ctx) => ctx.reply('Hey there!'));
bot.on('sticker', (ctx) => ctx.reply('👍'));

bot.command('/actions', async ctx => {
    const seriesId = ctx.message.text.split(' ')[1];
    const showInfo = await service.showItem(seriesId);

    if (!showInfo.error) {
        let formattedShowInfo = utils.prepareShowInfo(showInfo, seriesId);
        return ctx.replyWithPhoto(formattedShowInfo[0], formattedShowInfo[1]);
    }

    return ctx.reply(`Couldn't fetch show info. Please try again`);
});

// Callback query handlers
const onSubscribeRequest = async (ctx, seriesId) => {
    const subscribeResult = await service.addSubscription(ctx, seriesId)

    if (!subscribeResult.error) {
        ctx.editMessageReplyMarkup(JSON.stringify({}));
        return ctx.answerCallbackQuery('Subscription added');
    }
    ctx.editMessageReplyMarkup(JSON.stringify({}));
    return ctx.answerCallbackQuery(`Couldn't subscribe. Please try again`);
};

const onInfoRequest = async (ctx, seriesId) => {
	const showInfo = await service.showItem(seriesId);

	if (!showInfo.error) {
		let formattedShowInfo = utils.prepareShowInfo(showInfo, seriesId);
		return ctx.answerCallbackQuery('showing more info').then();
	}
	ctx.editMessageReplyMarkup(JSON.stringify({}));
	return ctx.reply(`Couldn't fetch show info. Please try again`);
};

const sendPhoto = async (ctx, seriesId) => {

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
        case 'subscribe':
            return onSubscribeRequest(ctx, updateData.id);
        case 'info':
            return onInfoRequest(ctx, updateData.id).then(() => console.log(ctx));
        default:
            break;
    }
});


module.exports = bot;
