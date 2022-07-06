module.exports = {
  /**
   * 修改用户信息
   * @url user/kh/updateUser 前端调用的url参数地址
   * @description 设置当前登录用户的昵称等用户信息
   * data 请求参数 说明
   * @param {String} nickname		用户的昵称
   * @param {String} avatar 		用户的头像
   * @param {Number} gender 		用户的性别
   * res 返回参数说明
   * @param {Number} code 错误码，0表示成功
   * @param {String} msg 详细信息
   */
  main: async (event) => {
    let { data = {}, util, originalParam } = event;
    let { uniID, vk } = util;
    let { uid } = data;
    let res = {};
    // 业务逻辑开始-----------------------------------------------------------
    // 允许修改的字段列表
    let updateKeys = ["nickname", "avatar", "gender", "social_info"];
    let dataJson = {};
    for (let i in updateKeys) {
      let key = updateKeys[i];
      if (vk.pubfn.isNotNull(data[key])) dataJson[key] = data[key];
    }
    dataJson.uid = uid;
    res = await uniID.updateUser(dataJson);
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  }
}
