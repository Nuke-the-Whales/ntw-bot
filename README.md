# ntw-bot

## Local setup
1. `npm install`
2. Create `.env` file in root directory with contents:
```
BOT_TOKEN={YOUR_BOT_TOKEN}
```
3. `npm start`

## Deployment
Deployment using  [Now](http://zeit.co)
1. `npm i -g now`
2. Create `.env` file in root directory with contents:
```
BOT_TOKEN={YOUR_BOT_TOKEN}
```
3. `now -e NODE_ENV="production" --dotenv`
