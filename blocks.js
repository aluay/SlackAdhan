let requestedCity, fajir, sunrise, dhuhr, asr, maghrib, isha;

const prayerTimesBlock = (
  requestedCity,
  fajir,
  sunrise,
  dhuhr,
  asr,
  maghrib,
  isha
) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `As-Salaam-Alaikum :handshake:\nBelow are the prayer times for: *${requestedCity}* :mosque:`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `:arrow_right: *Fajr:* ${fajir}`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `:arrow_right: *Sunrise:* ${sunrise}`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `:arrow_right: *Dhuhr:* ${dhuhr}`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `:arrow_right: *Asr:* ${asr}`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `:arrow_right: *Maghrib:* ${maghrib}`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `:arrow_right: *Isha:* ${isha}`
    }
  },
  {
    type: "divider"
  },
  {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `Prayer times are in YOUR times zone. If the times are wrong, it means there are other cities with the same name as *${requestedCity}*. Please try asking for prayer times of a neighboring city instead.\nPlease make Dua for me :palms_up_together:`
      }
    ]
  }
];

module.exports = {
  prayerTimesBlock
};
