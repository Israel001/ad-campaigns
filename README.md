## Description

Ad Campaigns

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# migrations
$ yarn run typeorm:run

# development
$ pm2 start npm --name "ad-campaigns" -- start

# watch mode
$ pm2 start npm --name "ad-campaigns" -- start:dev

# production mode
$ pm2 start npm --name "ad-campaigns" -- start:prod
```

## Local Services Required

```
Mysql > (greater than) 5.5.5 - For storing the campaigns in DB

Redis - For storing fetched campaigns in cache

PM2 - For managing the app process so that the app restarts automatically in case of an exception
```
