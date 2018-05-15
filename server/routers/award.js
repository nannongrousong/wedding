const express = require('express');
const router = express.Router();
const awardM = require('../model/award')
const serverConfig = require('../../config/server.config')
const utils = require('../common/utils')
const errorInfo = require('../common/errorInfo')

//  获取当前奖品列表
router.get('/', (req, res) => {
    awardM.list({
        type: 'local'
    }, (code, data) => {
        if (!code) {
            return res.json({ code: false, info: errorInfo.DB_OPER_ERROR });
        }

        data.forEach((value, index) => {
            delete value.count;
            delete value.left;
            delete value.ratio;
        })
        res.json({ code: true, data: data });
    })
})

//  获取当前用户的获奖记录
router.get('/record', (req, res) => {
    let userID = req.session.userID;

    if (userID == undefined || userID == '') {
        return res.json({ code: false, info: errorInfo.USER_INFO_LOST });
    }

    //  2018-05-11
    let time = utils.getYYYYMMDD(new Date())
    awardM.getAwardRec({ userID, time }, (code, records) => {
        if (!code) {
            return res.json({ code: code, info: errorInfo.DB_OPER_ERROR })
        }

        if (records.length <= serverConfig.localLotteryMax) {
            res.json({ code: true, data: { canLottery: true } })
        } else {
            res.json({ code: true, data: { canLottery: false } })
        }
    })
})

//  纯概率获取抽中的奖品
router.get('/lottery', (req, res) => {
    let userID = req.session.userID;

    if (userID == undefined) {
        return res.json({ code: false, info: errorInfo.USER_INFO_LOST });
    }

    //  抽奖算法，嘿嘿，很简单的噢
    awardM.list({ type: 'local' }, (code, awardList) => {
        if (!code) {
            return res.json({ code: false, info: errorInfo.DB_OPER_ERROR });
        }

        //  [0,100)
        let randomVal = parseInt(Math.random() * 100);
        let ratios = awardList.map((value) => {
            if (value.left > 0) {
                return value.ratio * 100
            } else {
                //  没有奖品了
                return 0;
            }
        });
        //  将原始的概率[40,30,20,10]转换成[0,40,70,90,100]后获取掉落区间
        let realRatios = [0];
        let sum = 0;
        let randomAwardIndex = -1;
        for (let r of ratios) {
            sum += r;
            realRatios.push(sum);
        }
        for (let i = 0; i < realRatios.length; i++) {
            if (randomVal < realRatios[i]) {
                randomAwardIndex = i - 1;
                break;
            }
        }

        if (randomAwardIndex == -1) {
            console.log(`用户:${userID},奖品:无;时间:${new Date().toLocaleString()}`)
            //  x ∈ [circle/2 * (4n-3), circle/2 * (4n-3) + circle] n>=1,Nmax=360/circle/2
            //  *2是"谢谢参与"部分
            let circle = 360 / (awardList.length * 2);
            let maxN = parseInt(360 / circle / 2);
            //  [1,5)
            let randomN = parseInt(Math.random() * maxN + 1);
            let minDeg = circle / 2 * (4 * randomN - 3);
            let maxDeg = minDeg + circle;

            //  由于页面绘制，线条占据几个PX
            minDeg += 3;
            maxDeg -= 3;
            let randomDeg = minDeg + parseInt(Math.random() * (maxDeg - minDeg));
            return res.send({ code: true, data: { deg: randomDeg, award: {} } });
        }

		console.log(`用户:${userID},奖品:${awardList[randomAwardIndex].name};时间:${new Date().toLocaleString()}`)
        //  记录表更新 && 奖品表剩余数量更新
        awardM.insert({
            userID,
            awardID: awardList[randomAwardIndex].award_id
        }, (code, recordID) => {
            if (code) {
                //  x ∈ [circle/2 * (2*index-1), circle/2 * (2*index+1) ]

                //  *2是"谢谢参与"部分
                let circle = 360 / (awardList.length * 2);
                let minDeg = circle / 2 * (2 * (randomAwardIndex * 2) - 1);
                let maxDeg = minDeg + circle;

                //  由于页面绘制，线条占据几个PX
                minDeg += 3;
                maxDeg -= 3;

                let randomDeg = minDeg + parseInt(Math.random() * (maxDeg - minDeg));

                res.send({
                    code: true, data: {
                        deg: randomDeg, award: {
                            recordID: recordID,
                            name: awardList[randomAwardIndex].name
                        }
                    }
                })
            } else {
                res.send({ code: false, info: errorInfo.DB_OPER_ERROR, data: { deg: 0 } });
            }
        })
    })
})

//  更新当前记录的备注信息（奖品联系方式等）
router.post('/mark', (req, res) => {
    let mark1 = req.body.mark1;
    let recordID = req.body.recordID;

    if (mark1 == undefined || recordID == undefined) {
        return res.json({ code: false, info: errorInfo.PARAM_INCOMPLETE });
    }

    awardM.updateMark({ recordID, mark1 }, (code) => {
        res.json({ code: code, info: '' })
    })
})

module.exports = router;

