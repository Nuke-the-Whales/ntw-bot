const generateSubscribeKeyboard = (seriesId, buttons) => {
    const subscribeButton = {
        text: 'Subscribe me to this show!',
        callback_data: JSON.stringify({
            type: 'subscribe',
            id: seriesId
        })
    };

    const showMoreButton = {
        text: 'Show more info',
        callback_data: JSON.stringify({
            type: 'info',
            id: seriesId
        })
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
    return buttons.map(button => ([
        dictionary[button]
    ]))

    // return subscribeKeyboard = {
    //     inline_keyboard: [[subscribeButton], [showMoreButton], [notInterestedButton]],
	// 	one_time_keyboard: true
    // }   
     return subscribeKeyboard = {
        inline_keyboard: buttons.map(btn => [dictionary[btn]]),
		one_time_keyboard: true
    }

}

const prepareSeriesList = (seriesList) => {
    return seriesList
        .filter(({type}) => type === 'show')
        .map(({imdb, score, title, year}) => ({
                type: 'article',
                id: imdb,
                title: title,
                input_message_content: {message_text: `${title}, year ${year}, with imdb score ${Math.floor(score)}`},
                reply_markup: generateSubscribeKeyboard(imdb, ['subscribe', 'info', 'leave'])
            })
	    );
};

const prepareShowInfo = ({poster, overview}, seriesId) => {
	return {
		photo: poster,
		overview,
		reply_markup: generateSubscribeKeyboard(seriesId, ['subscribe', 'leave'])
    }
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