const mysql = require('mysql')
const mysqlConf = require('../../config/server.config').mysql

/**
 * 通过userID获取头像地址
 * @param {Object} params 查询参数。{userID: ''}
 * @param {*} callBack 回调函数。参数1:操作结果;参数2:头像地址
 */
const getPortraitUrl = (params, callBack) => {
    const connection = mysql.createConnection(mysqlConf);
    connection.connect();

    let sql = 'select * from tbl_user_info where user_id= ? ';
    let { userID } = params
    let sqlParams = [userID]

    connection.query(sql, sqlParams, (err, res) => {
        if (err) {
            console.error(err)
            return callBack(false)
        }

        if (res.length > 0) {
            callBack(true, res[0].portrait_url);
            return;
        }

        callBack(true, 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1525711219399&di=686c8a11bbea37b09eeaa408b23a3cbf&imgtype=0&src=http%3A%2F%2Fa3.topitme.com%2F3%2Ffd%2Fa0%2F11280468511bba0fd3l.jpg');
    });

    connection.end();
}

/**
 * 插入|更新用户信息
 * @param {Object} params 用户信息。{userID: '',nickName: '', portraitUrl: ''}
 * @param {Function} callBack 回调函数。参数1：操作结果
 */
const edit = (params, callBack) => {
    const connection = mysql.createConnection(mysqlConf);
    connection.connect();

    let sql = 'replace into tbl_user_info (user_id,nick_name,portrait_url) values(?,?,?)';

    let { userID, nickName, portraitUrl } = params
    let sqlParams = [userID, nickName, portraitUrl]

    connection.query(sql, sqlParams, (err, res) => {
        if (err) {
            console.error(err)
            return callBack(false);
        }

        if (res.affectedRows >= 1) {
            return callBack(true)
        }

        return callBack(false)
    })

    connection.end();
}


module.exports = {
    getPortraitUrl: getPortraitUrl,
    edit: edit
}