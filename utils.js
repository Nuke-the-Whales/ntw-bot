const prepareSeriesList = (seriesList) => {
    return seriesList.map((seriesInfo) => ({
            type: 'photo',
            id: seriesInfo.id,
            title: seriesInfo.title,
            photo_url: seriesInfo.photo_url,
            thumb_url: seriesInfo.thumb_url,
            caption: seriesInfo.caption,
            description: seriesInfo.description,
            input_message_content: {message_text: "[BOT] "+video_info[k].url}
        })
    )
}

const errorMsg = {
    type: 'article',
    id: 'error',
    title: 'error',
    input_message_content: {message_text: 'something went wrong'}
}
module.exports.prepareSeriesList = prepareSeriesList;
module.exports.errorMsg = errorMsg;