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
}

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
}

const prepareSubscriptionResponse = () => {
    return [
        'Subscription successful',
        {
            reply_markup: afterSubscriptionKeyboard()
        }
    ];
};

const prepareSubscriptions = () => {
    return [
        ''
    ]
}

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