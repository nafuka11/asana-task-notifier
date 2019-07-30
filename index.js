const asana = require('./asana');
const slack = require('./slack');

require('dotenv').config();

const main = async () => {
  const tasks = await asana.fetchYesterdayTasks(process.env.ASANA_ACCESS_TOKEN);
  console.log(tasks);
  slack.sendMessage(tasks);
};

main();
