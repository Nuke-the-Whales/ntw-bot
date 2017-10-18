const fetch = require('node-fetch');
const API_ENDPOINT = process.env.ENDPOINT || 'http://localhost:8080';

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

const addSubscription = async (userId, showId) => {
    try {
        const response = fetch(`${API_ENDPOINT}/subscriptions`, { method: 'POST', body: {userId, showId} })
        const json = await response.json();
        return json;
    } catch (error) {
       console.log('error adding subscription', error);
       return {error: true}
    }
};

const getUpdates = async() => {
	try {
		const response = await fetch(`${API_ENDPOINT}/tv-shows`);
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('error showing series', error);
		return {error: true};
	}

    return Promise.resolve(mock);
}

const getSubscriptions = async() => {
	try {
		const response = await fetch(`${API_ENDPOINT}/subscriptions`);
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('error showing series', error);
		return {error: true};
	}


	return Promise.resolve(true);
}

const deleteSubscription = async() => {
	try {
		const response = await fetch(`${API_ENDPOINT}/show?id=${itemId}`);
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('error showing series', error);
		return {error: true};
	}

	return Promise.resolve(true);
}

module.exports.searchSeries = searchSeries;
module.exports.showItem = showItem;
module.exports.addSubscription = addSubscription;
module.exports.getUpdates = getUpdates;
module.exports.getSubscriptions = getSubscriptions;
module.exports.deleteSubscription = deleteSubscription;
