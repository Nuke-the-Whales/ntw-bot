const prepareSeriesList = (seriesList) => {
    return seriesList
        .filter(({type}) => type === 'show')
        .map(({imdb, score, title, year}) => ({
                type: 'article',
                id: imdb,
                title: title,
                input_message_content: {message_text: `${title}, year ${year}, with imdb score ${Math.floor(score)}`}
            })
	    );
};

const prepareShowInfo = ({poster, overview}) => {
	const subscribeKeyboard = {
		keyboard: [['Subscribe me to this show!'], ['Not interested']],
		one_time_keyboard: true
	};

	return {
		photo: poster,
		overview,
		reply_markup: subscribeKeyboard
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