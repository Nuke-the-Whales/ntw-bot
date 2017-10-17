const dotenv = require("dotenv");
const { Composer, Extra } = require('micro-bot');
const Telegraf = require('telegraf');
const { Telegram } = require('telegraf');
const { reply } = Telegraf;

const utils = require('./utils');
const service = require('./service');

dotenv.load();

const bot = new Telegraf();
const telega = new Telegram(process.env.BOT_TOKEN);

let chatId;
bot.command('/start', (ctx) => chatId = ctx.update.message.chat.id);
bot.command('/modern', ({ reply }) => reply('Yo'));
bot.command('/hipster', reply('λ'));

//telega.sendMessage(chatId, 'HI!');
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

//Pseudo-command
bot.hears(/^\/info/, async ctx => {
    const seriesId = ctx.update.message.text.split(' ')[1];
    const showInfo = await service.showItem(seriesId);

    if (!showInfo.error) {
        let formattedShowInfo = utils.prepareShowInfo(showInfo, seriesId);
        return ctx.replyWithPhoto(formattedShowInfo[0], formattedShowInfo[1]);
    }
    return ctx.reply(`Couldn't fetch show info. Please try again`);
});

bot.hears(/^\/subscribe/, async ctx => {
        const seriesId = ctx.update.message.text.split(' ')[1];
        const userId = ctx.update.message.from.id;
        const subscribeResult = await service.addSubscription(seriesId, userId);

        if (!subscribeResult.error) {
                let formattedSubscriptionInfo = utils.prepareSubscriptionResponse();
                return ctx.reply(formattedSubscriptionInfo[0], formattedSubscriptionInfo[1]);
        }
        return ctx.reply(`Couldn't subscribe. Please try again`);
    }
);

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
    return ctx.answerCallbackQuery('show more info', undefined, true).then((ctx) => console.log('123', ctx))
    
    const showInfo = await service.showItem(seriesId);

    if (!showInfo.error) {
        let formattedShowInfo = utils.prepareShowInfo(showInfo, seriesId);
        return ctx.answerCallbackQuery('showing more info').then();
    }
    ctx.editMessageReplyMarkup(JSON.stringify({}));
    return ctx.reply(`Couldn't fetch show info. Please try again`);
};

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
                case 'end':
                    return ctx.answerCallbackQuery('Ok. We will ping you when new episodes come out')
        default:
            break;
    }
});


module.exports = bot;
