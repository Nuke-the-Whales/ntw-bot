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

const addSubscription = async (userId, showId, showName) => {
    try {
		const response = await fetch(`${API_ENDPOINT}/subscriptions`, { 
			method: 'POST',
			body: JSON.stringify({userId: userId.toString(), showId, showName}) ,
			headers: { 'Content-Type': 'application/json' }
		});
		return response.status;
    } catch (error) {
       console.log('error adding subscription', error);
       return {error: true}
    }
};

const showSOData = async (showName) => {
	try {
		const response = await fetch(`${API_ENDPOINT}/so?query=${showName}`);
		const json = await response.json();
		if (!json.items.length) return null;
		const data = json.items
			.sort((a, b) => b.score - a.score)
			.slice(0, 3)
			.map(({link, title, score}) => ({
				link,
				title,
				score
			}));
		return data;
	} catch (error) {
		console.log('error fetching SO data', error);
		return {error: true}
	}
}

const getUpdates = async currentDate => {
	try {
		const response = await fetch(`${API_ENDPOINT}/tv-updates?date=${currentDate}`);
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('error showing series', error);
		return {error: true};
	}

    return Promise.resolve(mock);
}

const getSubscriptions = async () => {
	try {
		const response = await fetch(`${API_ENDPOINT}/subscriptions?userId=${chatId}`);
		if (response === null) {
			return null;
		}
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('error showing series', error);
		return {error: true};
	}
	return Promise.resolve(true);
};

const getSubscriptionsByChatId = async (chatId) => {
	try {
		const response = await fetch(`${API_ENDPOINT}/subscriptions/all?userId=${chatId}`);
		if (response === null) {
			return null;
		}
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('error getting subscriptions', error);
		return {error: true};
	}
};

const deleteSubscription = async (userId, showId) => {
	try {
		const response = await fetch(`${API_ENDPOINT}/subscriptions`, {
			method: 'DELETE',
			body: JSON.stringify({userId: userId.toString(), showId}) ,
			headers: { 'Content-Type': 'application/json' }
		});
		return response;
	} catch (error) {
		console.log('error deleting subscription', error);
		return {error: true};
	}

};

const getLastEpisode = async (seriesId) => {
	try {
		const response = await fetch(`${API_ENDPOINT}/show/last?id=${seriesId}`);
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('error getting last episode', error);
		return {error: true};
	}
}

module.exports.searchSeries = searchSeries;
module.exports.showItem = showItem;
module.exports.addSubscription = addSubscription;
module.exports.getUpdates = getUpdates;
module.exports.getSubscriptions = getSubscriptions;
module.exports.deleteSubscription = deleteSubscription;
module.exports.getSubscriptionsByChatId = getSubscriptionsByChatId;
module.exports.getLastEpisode = getLastEpisode;
module.exports.showSOData = showSOData;
