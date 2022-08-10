# HN Cafe API

## Hacker News aggregator's workflow

1. On node server boot up, connects to mongo database
2. HN aggregator module runs on database connected callback
3. Fetches `maxItemId` from HN API and starts listening on the `updates` API
4. Find `lastProcessedItemId` from setting's collection, if not exist consider `-1000` from the `maxItemId` as the start item
5. Get snapshots of all items in between the `maxItemId` and `lastProcessedItemId`
6. Filter the items which are just stories
7. Store the stories into the database
8. When done, update the `lastProcessedItemId` to the `maxItemId`

## APIs

### Get top stories for a given start and end time

`GET` `/stories?top=10&startTime=&endTime=`

## Time and Timezone

- HN data timestamps are in UTC (Unix time)
- Koffee News API endpoint queries support Unix time
