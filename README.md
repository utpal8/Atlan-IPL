# IPL_Data_Visualization (SocialCops Interview Assignment)
Data Visualization of IPL data using two datasets (Ball_by_Ball and Matches) provided by [Kaggle User - harsha547](https://kaggle.com/harsha547/indian-premier-league-csv-dataset).

The dashboard currently has following features:
1. Seasons (provides overview of each season data available in the dataset)
2. SeasonOverview (actually detailed, provides different visualizations for the season including total matches in the season, Net Run Rate of each match, total venues involved, etc.)
3. VenueOverview (provides specific info regarding a venue in selected season like average runs in innings, matches, highest scored match, etc.)
4. MatchOverview (provides information regarding a match from basic to advanced like match winner, type of extra runs received and conceded by either team, etc.)

 Minor notes:
 1. I've represented name of teams as Team_Name_{their id} just to give better visual appearance of them in the whole project.
 2. Data of some matches is not complete in Ball_by_Ball.csv so some parameters like NRR couldn't be calculated. For example: for match id - 501230, 501250 and a few more inning two neither has all players out nor does the match gets over.

Click [here](https://ipl-data-visualization.firebaseapp.com) to checkout the hosted app.

_Pardon me for slow loading of assets (CSV files), it's not really under my control. Heroku free dyno servers sleep. Read more about it [here](https://devcenter.heroku.com/articles/dynos#dyno-sleeping)._

## Technology Stack
1. VueJS (core frontend framework). Reasons to choose:
  * Out of the box lot of functionality (routing, data-binding and what not.)
  * Bonus Points 😛

2. ChartJS for rendering charts. Reason(s) to choose:
  * I already had experience with it before starting the project
  * It fulfills the exact need of the project and is lightweight as compared to other solutions.

3. Element UI for UI components, Reason(s) to choose:
  * I was exploring different options like vuetify but they felt too heavy compared to project's need, this one looks minimilistic.

4. LocalForage as storage API library, Reason(s) to choose:
  * Handled all my complex get/set works in IndexedDB
  * Naturally drops to another db (WebSQL, localstorage) if IndexedDB not available

5. Firebase for hosting (core app)
  * Easiest and fastest hosting solution in my opinion.

6. Heroku for hosting (backend file provider)
  * Made a express app which serves our CSVs deployed on heroku. Finally, CORS...!

## Bonus Points T&C (given vs fullfilled)
* You create the webapp in VueJS ✅ (tried to make code as modular as possible using component based architecture using VueJS)
* You can optimize the loading time ✅ (optimized loading time by caching the stuff in IndexedDB using localforage so we don't make fetch requests every time to get CSVs)
* You make it mobile responsive  ❌
* You make it a PWA ✅ (done, vue-pwa plugin of vue-cli automatically enabled PWA capabilities by injecting a workbox powered SW. I updated manifest.json file and added relevant app icons to let chrome show add to homescreen popup)
* You make it offline usable ✅ (after first load, the application is served offline via service worker, thanks to vue-pwa plugin)

## Light House Results 😎
![alt image1](https://res.cloudinary.com/dw7iunxs5/image/upload/v1546353927/Screenshot_2019-01-01_at_8.14.23_PM.png)

## What I think can be added using the datasets provided but didn't implement?
1. Player Partnerships' table in sorted order
2. Batting and Bowling stats of team (in particular season, match, venue)
3. Github type contribution chart for showing a match's ball by ball detail

## How to run?
```
npm install
npm run serve
```

## Some Handwritten planning before starting the project 👀
![alt image1](https://firebasestorage.googleapis.com/v0/b/test-1522465624044.appspot.com/o/4.jpeg?alt=media&token=e22ea8e3-bc07-4080-bfcc-d56b67f855b9)
![alt image2](https://firebasestorage.googleapis.com/v0/b/test-1522465624044.appspot.com/o/5.jpeg?alt=media&token=e435e488-9535-421d-8fbc-3568c40964f3)
![alt image3](https://firebasestorage.googleapis.com/v0/b/test-1522465624044.appspot.com/o/1.jpeg?alt=media&token=fb71e33d-4ad3-41dc-9f46-aa88edf56ea0)
![alt image4](https://firebasestorage.googleapis.com/v0/b/test-1522465624044.appspot.com/o/2.jpeg?alt=media&token=650b4e6b-b964-4c55-96c6-1227b5c6c2d3)
![alt image5](https://firebasestorage.googleapis.com/v0/b/test-1522465624044.appspot.com/o/3.jpeg?alt=media&token=deeb70f7-9635-483e-8c91-0ad4df3206ce)
