const express = require('express')
const router = express.Router();
const signM = require('../model/sign')
const errorInfo = require('../common/errorInfo')

//  查询签到状态
router.get('/', (req, res) => {
    let userID = req.session.userID;

    signM.getState({ userID }, (code, signState) => {
        res.json({ code: code, info: (!code ? errorInfo.DB_OPER_ERROR : ''), data: { signState } })
    })
})

//  更新签到信息
router.post('/', (req, res) => {
    let userID = req.session.userID;

    if (userID == undefined) {
        return res.json({ code: false, info: errorInfo.USER_INFO_LOST })
    }

    let signState = req.body.signState;
    signM.updateState({ userID, signState }, (code) => {
        res.json({ code: code, info: (code ? '' : errorInfo.DB_OPER_ERROR) });
    })
})

module.exports = router;