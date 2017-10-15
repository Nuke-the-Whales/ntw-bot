const dotenv = require("dotenv");
const { Composer, Extra } = require('micro-bot');
const Telegraf = require('telegraf');
const { reply } = Telegraf;

const service = require('service');
const utils = require('utils');

dotenv.load();

const bot = new Composer;

bot.command('/oldschool', (ctx) => ctx.reply('Hello'));
bot.command('/modern', ({ reply }) => reply('Yo'));
bot.command('/hipster', reply('λ'));

bot.hears('hi', (ctx) => ctx.reply('Hey there!'));
bot.on('sticker', (ctx) => ctx.reply('👍'));

//Search via inline query (@NukeTheWhalesBot ...)

bot.on('inline_query', ctx => {
    let searchText = ctx.update.inline_query.query;
    if (searchText.length > 3) {
        let seriesList = await service.searchSeries(searchText);

        if (!seriesList.error) {
            let formattedSeriesList = utils.prepareSeriesList(seriesList);
            return ctx.answerInlineQuery(formattedSeriesList, {cache_time: 0});
        }

        return ctx.answerInlineQuery(utils.errorMsg, {switch_pm_text: 'try some of other commands'});
    }
});

bot.on('chosen_inline_result', ctx => {
    let {from: user, result_id: seriesId} = ctx.update.chosen_inline_result;
    let subscription = await service.addSubscription(user.id, seriesId);

    if (!subscription.error) {
        return ctx.answerInlineQuery(utils.successMsg,
            {
                switch_pm_text: `subscription added! 
                Try other commands or continue searching for other series`
            })
    }

    return ctx.answerInlineQuery(utils.errorMsg, {switch_pm_text: 'Subscription failed. Try some of other commands'});
})


module.exports = bot;
