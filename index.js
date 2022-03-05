const { App } = require("@slack/bolt");
const adhan = require("adhan");
const moment = require("moment-timezone");
const openGeocoder = require("node-open-geocoder");
const blocks = require("./blocks.js");

const app = new App({
  // using the `authorize` function instead of the `token` property
  // to make use of both user and bot tokens
  authorize: () => {
    return Promise.resolve({
      botToken: process.env.SLACK_BOT_TOKEN,
      userToken: process.env.SLACK_USER_TOKEN
    });
  },
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // setting `ignoreSelf` to `false` to also retrieve events from our Bot user
  // e.g. we want to know when our Bot users is added to a channel through the
  // `member_joined_channel` event
  ignoreSelf: false,
  logLevel: "DEBUG"
});

/**
- Slash command function
- Get city from user input (body.text) and pass it to the geocode function and get lat and lon.
- Pass lat and lon to  to the coordinates function to get prayer times.
**/
app.command("/adhan", async ({ ack, body, say }) => {
  await ack();
  //Get user information and extract time zone from it
  const userInfo = await app.client.users.info({
    token: process.env.SLACK_BOT_TOKEN,
    user: body.user_id
  });
  openGeocoder()
    .geocode(body.text)
    .end((err, res) => {
      if (Object.keys(res).length === 0) {
        console.log("City not found");
      } else {
        //console.log(res);
        const date = new Date();
        const coordinates = new adhan.Coordinates(res[0].lat, res[0].lon);
        const params = adhan.CalculationMethod.MoonsightingCommittee();
        params.madhab = adhan.Madhab.Hanafi;
        const prayerTimes = new adhan.PrayerTimes(coordinates, date, params);

        let fajrTime = moment(prayerTimes.fajr)
          .tz(userInfo.user.tz)
          .format("h:mm A");
        let sunriseTime = moment(prayerTimes.sunrise)
          .tz(userInfo.user.tz)
          .format("h:mm A");
        let dhuhrTime = moment(prayerTimes.dhuhr)
          .tz(userInfo.user.tz)
          .format("h:mm A");
        let asrTime = moment(prayerTimes.asr)
          .tz(userInfo.user.tz)
          .format("h:mm A");
        let maghribTime = moment(prayerTimes.maghrib)
          .tz(userInfo.user.tz)
          .format("h:mm A");
        let ishaTime = moment(prayerTimes.isha)
          .tz(userInfo.user.tz)
          .format("h:mm A");

        app.client.chat.postEphemeral({
          token: process.env.SLACK_BOT_TOKEN,
          channel: body.channel_id,
          user: body.user_id,
          blocks: blocks.prayerTimesBlock(
            body.text,
            fajrTime,
            sunriseTime,
            dhuhrTime,
            asrTime,
            maghribTime,
            ishaTime,
            body.text
          )
        });
      }
    });
});

// Start the app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("Adhan app is running!");
})();
