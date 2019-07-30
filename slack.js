const request = require('request');

/**
 * taskリストからSlackのメッセージ内容を返す
 *
 * @param {*} tasks taskリスト
 * @returns Slack message blocks
 */
const createMessageBlocks = (tasks) => {
  const blocks = [];
  tasks.forEach((task) => {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:white_flower: *${task.name}*`,
      },
    });
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: task.completed_at.format('YYYY-MM-DD(ddd) HH:mm:ss'),
        },
      ],
    });
  });
  return blocks;
};

/**
 * Slackにタスク一覧をPOSTする
 *
 * @export
 * @param {*} tasks taskリスト
 */
exports.sendMessage = (tasks) => {
  const blocks = createMessageBlocks(tasks);

  const options = {
    uri: process.env.SLACK_INCOMING_WEBHOOL_URL,
    headers: {
      'Content-type': 'application/json',
    },
    json: {
      blocks,
    },
  };
  request.post(options, (error, response, body) => {
    if (response && response.statusCode !== 200) {
      console.error(`failed to send message: ${response.statusCode} ${body || ''}`);
    }
  });
};
