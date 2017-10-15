const fetch = require('node-fetch');
const API_ENDPOINT = 'http://example.example'

const searchSeries = async (searchInput) => {
    try {
        const response = fetch(`${API_ENDPOINT}/search`)
        const json = await response.json();
    } catch (error) {
        console.log('error searching series', error)
    }

    if (json) {
        return json;
    }

    return {error: true};
}

const addSubscription = async (userId, seriesId) => {
    try {
        const response = fetch(`${API_ENDPOINT}`, { method: 'POST', body: {userId, seriesId} })
        const json = await response.json();
    } catch (error) {
        console.log('error adding subscription', error);
    }

    if (json) {
        return json
    }

    return {error: true}
}

module.exports.searchSeries = searchSeries;
module.exports.addSubscription = addSubscription;