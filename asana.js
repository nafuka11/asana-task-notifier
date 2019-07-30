const asana = require('asana');
const moment = require('moment');

// workspaceのindex。1つのworkspaceにのみ所属している場合は0。複数の場合可変
const WORKSPACE_INDEX = 0;

/**
 * 前日〜現在までに完了したtaskリストを返す
 *
 * @export
 * @param {*} token Asanaのアクセストークン
 * @returns taskリスト
 */
exports.fetchYesterdayTasks = (token) => {
  const yesterday = moment().add(-1, 'days').hours(0).minutes(0)
    .seconds(0)
    .milliseconds(0);
  const client = asana.Client.create().useAccessToken(token);

  return client.users.me()
    .then((user) => {
      const userId = user.id;
      const workspaceId = user.workspaces[WORKSPACE_INDEX].id;
      return client.tasks.findAll({
        assignee: userId,
        workspace: workspaceId,
        completed_since: yesterday.toISOString(),
        opt_fields: 'id,name,completed,completed_at',
      });
    })
    // 50件までtaskを取得する（Resource.DEFAULT_PAGE_LIMIT）
    .then(response => response.data)
    .filter(task => task.completed === true)
    .then(list => list.sort((a, b) => a.completed_at.localeCompare(b.completed_at)).map(value => ({
      name: value.name,
      completed_at: moment(value.completed_at),
    })))
    .catch((e) => {
      console.error(e);
    });
};
