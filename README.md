# ntw-bot

## Local setup
1. `npm install`
2. Create `.env` file in root directory with contents:
```
BOT_TOKEN={YOUR_BOT_TOKEN}
```
3. `npm start`

## Deployment
Deployment using  [Heroku](http://heroku.com)
1. Install [heroku binaries](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) and login via console
2. Update Heroku config:
```
heroku config:set --app YourAppId BOT_TOKEN=YOUR_BOT_TOKEN
heroku config:set --app YourAppId BOT_DOMAIN=https://YourAppId.herokuappp.com
```
3. `git push heroku master`
