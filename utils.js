const generateSubscribeKeyboard = (seriesId, buttons, type) => {
    const subscribeButton = {
        text: 'Subscribe me to this show!',
        callback_data: JSON.stringify({
            type: 'subscribe',
            id: seriesId
        })
    };

    const showMoreButton = {
        text: 'Show more info',
	    switch_inline_query_current_chat: ''
    };

    const notInterestedButton = {
        text: 'Not interested... Take me back to search',
        switch_inline_query_current_chat: ''
    };

    const dictionary = {
        subscribe: subscribeButton,
        info: showMoreButton,
        leave: notInterestedButton
    };

    return {
        inline_keyboard: buttons.map(btn => [dictionary[btn]])
    };
};

const prepareSeriesList = (seriesList) => {

    return seriesList
        .filter(({type}) => type === 'show')
        .map(({imdb, score, title, year}) => ({
                type: 'article',
                id: imdb,
                title: title,
                input_message_content: {message_text: `Good choice... What do you want to do next?`},
                reply_markup: generateSubscribeKeyboard(imdb, ['subscribe', 'info', 'leave'], 'inline')
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

const errorMsg = {
    type: 'article',
    id: 'error',
    title: 'error',
    input_message_content: {message_text: 'something went wrong'}
};

module.exports.prepareSeriesList = prepareSeriesList;
module.exports.prepareShowInfo = prepareShowInfo;
module.exports.errorMsg = errorMsg;