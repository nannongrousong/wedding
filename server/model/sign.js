const mysql = require('mysql')
const mysqlConf = require('../../config/server.config').mysql

/**
 * 更新签到状态
 * @param {Object} params  参数信息。{userID: '', signState: ''}
 * @param {Function} callBack 回调函数。param1:操作结果
 */
const updateState = (params, callBack) => {
    const connection = mysql.createConnection(mysqlConf);
    connection.connect();

    let sql = 'replace into tbl_sign_info values(?,?)';
    let {userID, signState} = params
    let sqlParams = [userID, signState];

    connection.query(sql, sqlParams, (err, res) => {
        if (err) {
            console.error(err)
            return callBack(false);
        }

        if(res.affectedRows >= 1) {
            return callBack(true);
        }

        callBack(false);
    })

    connection.end();
}

/**
 * 获取用户签到信息
 * @param {Object} params 查询参数。{userID: ''}
 * @param {Function} callBack 回调函数。param1:操作结果;param2:签到状态
 */
const getState = (params, callBack) => {
    const connection = mysql.createConnection(mysqlConf);
    connection.connect();

    let sql = 'select sign_state from tbl_sign_info where user_id = ?';
    let {userID} = params;
    let sqlParams = [userID];

    connection.query(sql, sqlParams, (err, res) => {
        if (err) {
            console.error(err)
            return callBack(false);
        }

        if (res.length > 0) {
            return callBack(true, res[0].sign_state);
        }

        callBack(false)
    })

    connection.end()
}

module.exports = {
    updateState: updateState,
    getState: getState
}