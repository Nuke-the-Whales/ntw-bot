const generateSubscribeKeyboard = (seriesId, buttons, type) => {
    const subscribeButton = {
        text: `/subscribe ${seriesId}`
    };

    const showMoreButton = {
        text: 'Show more info',
        callback_data: JSON.stringify({type: 'info', id: seriesId})
    };

    const notInterestedButton = {
        text: '/end',
    };

    const dictionary = {
        subscribe: subscribeButton,
        info: showMoreButton,
        leave: notInterestedButton
    };

    return {
        keyboard: buttons.map(btn => [dictionary[btn]]),
        one_time_keyboard: true,
        resize_keyboard: true
    };
};

const afterSubscriptionKeyboard = () => {
    const continueSearchButton = {
        text: 'Continue searching series...',
        switch_inline_query_current_chat: ''
    };

    const endButton = {
        text: `No I'm done`,
        callback_data: JSON.stringify({type: 'end'})
    };

    return {
        inline_keyboard: [[continueSearchButton], [endButton]]
    }
};

const prepareSeriesList = (seriesList) => {
    return seriesList
        .filter(({type}) => type === 'show')
        .map(({imdb, score, title, year}) => ({
                type: 'article',
                id: imdb,
                title: title,
                input_message_content: {message_text: `/info ${imdb}`},
            })
        );
};

const prepareShowInfo = ({poster, overview}, seriesId) => {
    let preparedPoster;
    if (poster.startsWith('https')) {
        preparedPoster = poster.replace('https', 'http');
    } else {
        preparedPoster = poster;
    }

    return [{
                url: preparedPoster
            }, {
                caption: overview,
                reply_markup: generateSubscribeKeyboard(seriesId, ['subscribe', 'leave'], 'inline')
            }];
};

const prepareTorrentKeyboard = (seriesId) => {
    const yesButton = {
        text: `Let's see what you got`,
        callback_data: JSON.stringify({type: 'yesTorrent', id: seriesId})
    };

    const noButton = {
        text: 'Uhm... No thanks, that seems dangerous.',
        callback_data: JSON.stringify({type: 'noTorrent'})
    }

    return {
        inline_keyboard: [[yesButton], [noButton]]
    };
};

const prepareSubscriptionResponse = () => {
    return [
        'Subscription successful',
        {
            reply_markup: afterSubscriptionKeyboard()
        }
    ];
};

const prepareSubscriptions = (subscriptions) => {
// bot.command('/start', (ctx) => chatId = telega.sendMessage(ctx.update.message.chat.id, `<a href="tg://bot_command?command=/start&bot=NukeTheWhalesBot">/start</a>`,{parse_mode: "HTML"}));

	console.log('subs', subscriptions)

    return subscriptions.map(sub => {
        let parsedSub = {};
        parsedSub.title = 'test';
        parsedSub.delete = `<a href="tg://bot_command?command=/delete ${sub.id}&bot=NukeTheWhalesBot">Delete subscription</a>`
        return `${parsedSub.title}\n${parsedSub.delete}`;
    }).join('\n\n');
};

const prepareTorrentMarkup = (torrents) => {
    return torrents.map(torrent => {
        let parsedTorrent = {};
	    parsedTorrent.title = `<i>${torrent.title}</i>`;
	    parsedTorrent.size = `<b>Size:</b> ${torrent.size}`;
	    parsedTorrent.url = `<b>Magic Link:</b> <a href="${torrent.url}">Download</a>`;

        return `${parsedTorrent.title}\n${parsedTorrent.size}\n${parsedTorrent.url}`
    }).join('\n\n');
};

const errorMsg = {
    type: 'article',
    id: 'error',
    title: 'error',
    input_message_content: {message_text: 'something went wrong'}
};

module.exports.prepareSeriesList = prepareSeriesList;
module.exports.prepareShowInfo = prepareShowInfo;
module.exports.prepareSubscriptionResponse = prepareSubscriptionResponse;
module.exports.errorMsg = errorMsg;
module.exports.prepareTorrentKeyboard = prepareTorrentKeyboard;
module.exports.prepareTorrentMarkup = prepareTorrentMarkup;
module.exports.prepareSubscriptions = prepareSubscriptions;
