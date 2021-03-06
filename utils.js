const generateSubscribeKeyboard = (seriesId, showName, buttons, type) => {
    const subscribeButton = {
        text: `/subscribe ${seriesId} ${showName}`
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

const afterSubscriptionKeyboard = (seriesId) => {
    const continueSearchButton = {
        text: 'Continue searching series...',
        switch_inline_query_current_chat: ''
    };

    const getMemeButton = {
        text: `Might you be interested in some FUNNY PICTURES?`,
        callback_data: JSON.stringify({type: 'meme', id: seriesId})
    };

    const getSOQuestionsButton = {
        text: 'Check out what community talks about (SPOILER ALERT)',
        callback_data: JSON.stringify(({type: 'SO', id: seriesId}))
    };

    const endButton = {
        text: `No I'm done`,
        callback_data: JSON.stringify({type: 'end'})
    };

    return {
        inline_keyboard: [[continueSearchButton], [getMemeButton], [getSOQuestionsButton], [endButton]]
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

const prepareShowInfo = (show, seriesId) => {
    let preparedPoster;
    let showName = show.original_name;
    if (show.poster.startsWith('https')) {
        preparedPoster = show.poster.replace('https', 'http');
    } else {
        preparedPoster = show.poster;
    }
    return [{
                url: preparedPoster
            }, {
                reply_markup: generateSubscribeKeyboard(seriesId, showName, ['subscribe', 'leave'], 'inline'),
                parse_mode: "HTML"
            }, {overview: show.overview, title: show.original_name, rating: show.vote_average, votes: show.vote_count}];
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

const prepareSubscriptionResponse = (seriesId) => {
    return [
        'Subscription successful',
        {
            reply_markup: afterSubscriptionKeyboard(seriesId),
            parse_mode: "HTML"
        }
    ];
};

const prepareSubscriptions = (subscriptions) => {
// bot.command('/start', (ctx) => chatId = telega.sendMessage(ctx.update.message.chat.id, `<a href="tg://bot_command?command=/start&bot=NukeTheWhalesBot">/start</a>`,{parse_mode: "HTML"}));

    const imdbArr = Object.keys(subscriptions);
	let subs = [];
	for (var sub in subscriptions) {
	    subs.push({id: sub, title: subscriptions[sub]});
    }
    return subs.map(sub => {
        let parsedSub = {};
        parsedSub.title = `<b>${sub.title}</b>`;
        parsedSub.subscribe = `<b>Fetch info about show: </b>/subscribe_${sub.id}`;
        parsedSub.delete = `<b>Unsubsribe: </b><a href="tg://bot_command?command=/delete&bot=NukeTheWhalesBot">/delete_${sub.id}</a>`
        return `${parsedSub.title}\n${parsedSub.subscribe}\n${parsedSub.delete}`;
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
