module.exports = {
  /**
   * 查询用户列表(用于后端用户选择器的搜索数据)
   * @url admin/select/kh/user 前端调用的url参数地址
   * data 请求参数 说明
   * @param {String} searchvalue 搜索内容
   * res 返回参数说明
   * @param {Number} code 错误码，0表示成功
   * @param {String} msg 详细信息
   */
  main: async (event) => {
    let { data = {}, userInfo, util, filterResponse, originalParam } = event;
    let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
    let { uid } = data;
    let res = { code: 0, msg: '' };
    // 业务逻辑开始-----------------------------------------------------------
    // 可写与数据库的交互逻辑等等
    let { searchvalue } = data;
    if (!searchvalue) {
      return { code: 0, list: [] };
    }
    let dbName = "uni-id-users";
    let fieldJson = {
      _id: true,
      username: true,
      nickname: true,
      mobile: true,
    };
    let sortArr = [];
    // 排序规则开始-----------------------------------------------------------
    sortArr.push({
      "name": "register_date",
      "type": "desc"
    });
    // 排序规则结束-----------------------------------------------------------
    // 查询条件开始-----------------------------------------------------------
    let whereJson = {};
    let andArr = [];
    if (searchvalue) {
      // 查询包含searchvalue的数据
      try {
        let regExp = new RegExp(searchvalue);
        let orObj = _.or([
          {
            "username": regExp
          },
          {
            "nickname": regExp
          },
          {
            "mobile": regExp
          },
          {
            "_id": searchvalue
          }
        ]);
        andArr.push(orObj);
      } catch (err) {
        return { code: -1, msg: '请输入合法的查询内容' };
      }
    }
    if (andArr.length > 0) {
      whereJson = _.and(andArr);
    }
    // 查询条件结束-----------------------------------------------------------
    let selectRes = await vk.baseDao.select({
      dbName: dbName,
      pageIndex: 1,
      pageSize: 10,
      fieldJson: fieldJson,
      whereJson: whereJson,
      sortArr: sortArr
    }, util);
    let list = [];
    for (let i in selectRes.rows) {
      let item = selectRes.rows[i];
      let value = item._id;
      let label = item.nickname || "未设置昵称";
      if (item.mobile) {
        item.mobile = vk.pubfn.hidden(item.mobile, 3, 4);
        label += `（${item.mobile}）`;
      } else if (item.username) {
        item.username = vk.pubfn.hidden(item.username, 2, 3);
        label += `（${item.username}）`;
      }
      list.push({
        value: value,
        label: label
      });
    }
    res.list = list;
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  }

}
