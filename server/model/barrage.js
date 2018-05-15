const mysql = require('mysql')
const mysqlConf = require('../../config/server.config').mysql

//  插入弹幕信息
/**
 * 
 * @param {Object} params 弹幕信息。{userID: '', text: ''}
 * @param {Function} callBack 回调函数。param1:操作结果;param2:插入后的barrageID
 */
const insert = (params, callBack) => {
    const connection = mysql.createConnection(mysqlConf);
    connection.connect();

    let sql = 'insert into tbl_barrage_info(user_id,text) values(?,?)'
    let {userID, text} = params
    let sqlParams = [userID, text]

    connection.query(sql, sqlParams, (err, res) => {
        if (err) {
            console.error(err)
            return callBack(false);
        }

        if(res.affectedRows == 1) {
            return callBack(true, res.insertId);
        }
        
        callBack(false);
    })

    connection.end();
}

module.exports = {
    insert: insert
}