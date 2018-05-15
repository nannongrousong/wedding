const mysql = require('mysql')
const mysqlConf = require('../../config/server.config').mysql


/**
 * 获取系统中所有奖品
 * @param {Object} params 查询参数。{type: ''}
 * @param {Function} callBack 回调函数。param1：执行结果；param2：返回数据
 */
const list = (params, callBack) => {
    const connection = mysql.createConnection(mysqlConf);
    connection.connect();

    let sql = 'select * from tbl_award_info where type = ?'
    let { type } = params
    let sqlParams = [type]

    connection.query(sql, sqlParams, (err, res) => {
        if (err) {
            console.error(err);
            return callBack(false);
        }

        callBack(true, res)
    })

    connection.end();
}

/**
 * 获取用户的奖品记录信息
 * @param {Object} params 查询参数。{userID: '', time: ''}
 * @param {Function} callBack 回调函数。param1：执行结果；param2：返回数据
 */
const getAwardRec = (params, callBack) => {
    const connection = mysql.createConnection(mysqlConf);
    connection.connect();

    let sql = 'select record.user_id,record.award_time,info.* from tbl_award_record record,tbl_award_info info where  record.award_id=info.award_id and info.type="local" and user_id = ? and date(award_time) = ? ';
    let { userID, time } = params
    let sqlParams = [userID, time]

    connection.query(sql, sqlParams, (err, res) => {
        if (err) {
            console.error(err)
            return callBack(false);
        }

        callBack(true, res);
    })

    connection.end();
}

/**
 * 插入获奖记录并更新奖品剩余数量
 * @param {Object} params 查询参数。{userID: '', awardID: ''}
 * @param {Function} callBack 回调函数。param1：执行结果；param2：新插入的记录ID
 */
const insert = (params, callBack) => {
    const connection = mysql.createConnection(mysqlConf);
    connection.connect();

    connection.beginTransaction(err => {
        if (err) {
            console.error(err)
            return callBack(false);
        }

        let sql1 = 'insert into tbl_award_record(user_id,award_id) values(?,?)';
        let {userID, awardID} = params
        let sqlParams1 = [userID, awardID]
        connection.query(sql1, sqlParams1, (err, res) => {
            if (err) {
                return connection.rollback(() => {
                    console.error(err);
                    callBack(false);
                })
            }

            let recordID = res.insertId;
            let sql2 = 'update tbl_award_info a set a.left=a.left-1 where award_id = ?';
            let sqlParams2 = [awardID]
            connection.query(sql2, sqlParams2, (err, res) => {
                if (err) {
                    return connection.rollback(() => {
                        console.error(err)
                        callBack(false);
                    })
                }

                connection.commit((err) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.error(err)
                            callBack(false);
                        })
                    }

                    callBack(true, recordID);
                    connection.end()
                })
            })
        })
    })
}

/**
 * 更新获奖记录的备注信息 
 * @param {Object} params 查询参数。{recordID: '', mark1: ''}
 * @param {*} callBack 回调函数。param1:操作结果
 */
const updateMark = (params, callBack) => {
    const connection = mysql.createConnection(mysqlConf);
    connection.connect();

    let sql = 'update tbl_award_record set mark1 = ? where record_id = ?'
    let {mark1, recordID} = params
    let sqlParam = [mark1, recordID]

    connection.query(sql, sqlParam, (err, res) => {
        if (err) {
            console.error(err);
            return callBack(false);
        }

        if (res.affectedRows == 1) {
            return callBack(true);
        }

        callBack(false);
    })

    connection.end();
}

module.exports = {
    list: list,
    insert: insert,
    getAwardRec: getAwardRec,
    updateMark: updateMark
}