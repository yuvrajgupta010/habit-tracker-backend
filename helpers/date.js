const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const START_TIME = dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A");

module.exports = {
  START_TIME,
};
