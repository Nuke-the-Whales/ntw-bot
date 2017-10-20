const dotenv = require("dotenv");
dotenv.load();
const { Composer, Extra } = require('micro-bot');
const Telegraf = require('telegraf');
const { Telegram } = require('telegraf');
const { reply } = Telegraf;

const utils = require('./utils');
const service = require('./service');


const bot = new Telegraf();
const telega = new Telegram(process.env.BOT_TOKEN);

// bot.command('/start', (ctx) => chatId = telega.sendMessage(ctx.update.message.chat.id, `<a href="tg://bot_command?command=/start&bot=NukeTheWhalesBot">/start</a>`,{parse_mode: "HTML"}));
// bot.command('/start', (ctx) => chatId = ctx.update.message.chat.id);

let recentManualUpdateTrigger = false;

// Update logic
const sendUpdate = ({chat_id, data}) => {
    return this.telega.sendMessage(chat_id, data);
};

const sendUpdates = async () => {
    let updatesFetchSuccess = false;
    let updatesFetchTries = 0;
    const currentDate = new Date().toISOString().slice(0,10)

	while (updatesFetchTries < 5 && !updatesFetchSuccess) {
	    let updateData;
	    try {
	        updateData = await service.getUpdates(currentDate);
        } catch (error) {
	        console.log('error getting updates', error);
		    updatesFetchTries++;
        }

		if (!updateData.error) {
			updatesFetchSuccess = true;
			updateData.forEach(update => sendUpdate({chat_id, data}));
		} else {
			updatesFetchTries++;
        }
	}

	return;
};

setInterval(() => sendUpdates(), 1000 * 60 * 60 * 24);



// bot.command('/actions', async ctx => {
//     const seriesId = ctx.message.text.split(' ')[1];
//     const showInfo = await service.showItem(seriesId);
//
//     if (!showInfo.error) {
//         let formattedShowInfo = utils.prepareShowInfo(showInfo, seriesId);
//         return ctx.replyWithPhoto(formattedShowInfo[0], formattedShowInfo[1]);
//     }
//
//     return ctx.reply(`Couldn't fetch show info. Please try again`);
// });

//Pseudo-command
bot.hears(/^\/start/, async ctx => {
	telega.sendMessage(ctx.update.message.chat.id,
		'Lets begin by adding some subscriptions. Click "Search" Button to start',
		{reply_markup:
			{inline_keyboard: [
				[
					{
						text: 'Search',
						switch_inline_query_current_chat: ''
					}
				]
			]}
		});

});


bot.hears(/^\/info/, async ctx => {
    const seriesId = ctx.update.message.text.split(' ')[1];
    const showInfo = await service.showItem(seriesId);
    const chatId = ctx.update.message.chat.id;

    if (!showInfo.error) {
        let formattedShowInfo = utils.prepareShowInfo(showInfo, seriesId);
        let data = formattedShowInfo[2];
        let textInfo = `<b>${data.title}</b>\n\nRating: <b>${data.rating}</b>/10 (${data.votes} votes)\n\n${data.overview}`
        return ctx.replyWithPhoto(formattedShowInfo[0], formattedShowInfo[1]).then(() => telega.sendMessage(chatId, textInfo, {parse_mode: "HTML"}));
    }
    return ctx.reply(`Couldn't fetch show info. Please try again`);
});

bot.hears(/^\/subscribe/, async ctx => {
		let seriesId;
		let userId;
		let showNameArr;
		let showName;
		if (ctx.update.message.text.startsWith('/subscribe_')) {
			seriesId = ctx.update.message.text.split('_')[1];
			userId = ctx.update.message.from.id;
			showName = 'plaaaceholder';
		} else {
			seriesId = ctx.update.message.text.split(' ')[1];
			userId = ctx.update.message.from.id;
			showNameArr = ctx.update.message.text.split(' ').slice(2);
			showName = showNameArr.length > 1 ? showNameArr.join(' '): showNameArr.join('');
		}

        const subscribeResult = await service.addSubscription(userId, seriesId, showName);
        const lastEpisodeInfo = await service.getLastEpisode(seriesId);
        const replyStr = `Subscription successful!\n<b>Last episode:</b> S${lastEpisodeInfo.season}E${lastEpisodeInfo.number} - ${lastEpisodeInfo.title}`
        if (!subscribeResult.error) {
            let formattedSubscriptionInfo = utils.prepareSubscriptionResponse(seriesId);
            ctx.reply(replyStr, formattedSubscriptionInfo[1]);
            // const subInfo = await service.getSubscriptionsByChatId(ctx.update.message.chat.id);
            telega.sendMessage(ctx.update.message.chat.id, `Psst.. I have something useful for you, but you shouldn't say you got this from me`, {
                reply_markup: utils.prepareTorrentKeyboard(seriesId)
            });
            return ctx.update.message.chat.id
        }
        ctx.reply(`Couldn't subscribe. Please try again`);
        return null;
    }
)

bot.hears(/^\/myshows/, async ctx => {
		const subscriptions = await service.getSubscriptionsByChatId(ctx.update.message.chat.id);
		if (subscriptions === null) {
			return ctx.reply('No subscriptions found');
		}

		if (!subscriptions.error) {
			let formattedSubscriptions = utils.prepareSubscriptions(subscriptions);
			// bot.command('/start', (ctx) => chatId = telega.sendMessage(ctx.update.message.chat.id, `<a href="tg://bot_command?command=/start&bot=NukeTheWhalesBot">/start</a>`,{parse_mode: "HTML"}));
			return telega.sendMessage(ctx.update.message.chat.id, formattedSubscriptions, {parse_mode: "HTML"});
		}
		return ctx.reply(`Couldn't fetch your subscriptions. Please try again`);
	}
);

bot.hears(/^\/delete/, async ctx => {
	const seriesId = ctx.update.message.text.split('_')[1];
	const chatId = ctx.update.message.chat.id;
	const deleteSubscriptionResult = await service.deleteSubscription(chatId, seriesId);

		if (!deleteSubscriptionResult.error) {
			return ctx.reply('You have been unsubscribed from this show');
		}
		return ctx.reply(`Couldn't unsubscribe. Please try again`);
	}
);

bot.hears(/^\/testupdate/, async ctx => {
		if (recentManualUpdateTrigger) return;
		sendUpdates();
		recentManualUpdateTrigger = true;
		setTimeout(() => recentManualUpdateTrigger = false, 7000);
	}
);

// Callback query handlers
// const onSubscribeRequest = async (ctx, seriesId) => {
//     const subscribeResult = await service.addSubscription(ctx, seriesId);
//
//     if (!subscribeResult.error) {
//         ctx.editMessageReplyMarkup(JSON.stringify({}));
//         return ctx.answerCallbackQuery('Subscription added');
//     }
//     ctx.editMessageReplyMarkup(JSON.stringify({}));
//     return ctx.answerCallbackQuery(`Couldn't subscribe. Please try again`);
// };
// //
// const onInfoRequest = async (ctx, seriesId) => {
//     return ctx.answerCallbackQuery('show more info', undefined, true).then((ctx) => console.log('123', ctx))
//
//     const showInfo = await service.showItem(seriesId);
//
//     if (!showInfo.error) {
//         let formattedShowInfo = utils.prepareShowInfo(showInfo, seriesId);
//         return ctx.answerCallbackQuery('showing more info').then();
//     }
//     ctx.editMessageReplyMarkup(JSON.stringify({}));
//     return ctx.reply(`Couldn't fetch show info. Please try again`);
// };

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
        // case 'subscribe':
        //     return onSubscribeRequest(ctx, updateData.id);
        // case 'info':
        //     return onInfoRequest(ctx, updateData.id).then(() => console.log(ctx));
        case 'yesTorrent': {
            const chatId = ctx.update.callback_query.message.chat.id;
            const showInfo = await service.showItem(updateData.id);
            const torrents = showInfo.torrents.slice(0, 3);
            ctx.editMessageReplyMarkup(JSON.stringify({}));
            ctx.answerCallbackQuery('Check this out!');
            const formattedTorrents = utils.prepareTorrentMarkup(torrents);
            telega.sendMessage(chatId, formattedTorrents, {parse_mode: 'HTML'});
        }
        case 'noTorrent': {
            ctx.editMessageReplyMarkup(JSON.stringify({}));
	        return ctx.answerCallbackQuery('No problem. Ask me anytime later');
        }
	    case 'SO': {
		    const chatId = ctx.update.callback_query.message.chat.id;
		    const showInfo = await service.showItem(updateData.id);
		    const showName = showInfo.original_name;
		    const lang = showInfo.original_language;
		    const SOData = await service.showSOData(showName);
		    if (SOData === null) return ctx.answerCallbackQuery('Sorry. No StackExchange question found for this series');
		    const responseMsg = SOData.map((item) => `<b>Title: </b>${item.title}\n<b>Link: </b><a href='${item.link}'>${item.link}</a>\n<b>Score: </b>${item.score}`);
		    const responseMsg2 = SOData.map((item) => `<b>Title: </b>${item.title}\n`);
		    const formatted = responseMsg.join('\n\n');

		    telega.sendMessage(chatId, formatted, {parse_mode: "HTML"});
		    return ctx.answerCallbackQuery('Here are top stackexchange questions for this series');
	    }
        case 'end': {
            ctx.editMessageReplyMarkup(JSON.stringify({}));
	        return ctx.answerCallbackQuery('Ok. We will ping you when new episodes come out');
        }
        case 'meme': {
            const chatId = ctx.update.callback_query.message.chat.id;
            const memeShownIndex = updateData.memeShownIndex || 0;
            let showInfo;
            if (memeShownIndex !== 'DONE') {
                showInfo = await service.showItem(updateData.id);
            } else {
                ctx.editMessageReplyMarkup(JSON.stringify({}));
                telega.sendMessage(chatId, 'Ran out of memes. Sorry...', {reply_markup: {inline_keyboard: [[
                    {
                        text: 'Continue searching series?',
                        switch_inline_query_current_chat: ''
                    }
                ]]}});

                return;
            }
            const memes = showInfo.memes;
            const memeUrl = memes[memeShownIndex];
            
            ctx.answerCallbackQuery('TOP KEK');
            telega.sendPhoto(chatId, memeUrl, {reply_markup: {inline_keyboard: [[
                {
                    text: 'MOAR?',
                    callback_data: JSON.stringify({type: 'meme', id: updateData.id, memeShownIndex: memeShownIndex === 4 ? 'DONE' : memeShownIndex + 1})
                }
            ]]}});
        }
        default:
            break;
    }
});



module.exports = bot;
