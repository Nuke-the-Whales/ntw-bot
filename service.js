const fetch = require('node-fetch');
const API_ENDPOINT = 'http://localhost:8080'

const searchSeries = async (searchInput) => {
    try {
        const response = await fetch(`${API_ENDPOINT}/search?title=${searchInput}`);
        const json = await response.json();
        return json;
    } catch (error) {
        console.log('error searching series', error);
        return {error: true}
    }
};

const showItem = async (itemId) => {
    try {
        const response = await fetch(`${API_ENDPOINT}/show?id=${itemId}`);
        const json = await response.json();
        return json;
    } catch (error) {
        console.log('error showing series', error);
        return {error: true};
    }
};

const addSubscription = async (userId, seriesId) => {
    // try {
    //     const response = fetch(`${API_ENDPOINT}`, { method: 'POST', body: {userId, seriesId} })
    //     const json = await response.json();
    //     return json;
    // } catch (error) {
    //    console.log('error adding subscription', error);
    //    return {error: true}
    // }
    return Promise.resolve(true);
};

module.exports.searchSeries = searchSeries;
module.exports.showItem = showItem;
module.exports.addSubscription = addSubscription;
