const path = require('path')
const express = require('express')
const router = express.Router();
const userM = require('../model/user')
const utils = require('../common/utils')
const serverConfig = require('../../config/server.config')

router.get('/', (req, res, next) => {
    if (!req.headers['user-agent'].includes('MicroMessenger')) {
        next('route');
    } else {
        next();
    }
}, (req, res, next) => {
    let state = req.query.state;
    if (state == undefined && req.session.userID == undefined) {
        //  微信未验证、未登陆
        let state = 'weixin'
        let appUrl = encodeURIComponent(callBackUrl);
        let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appID}&redirect_uri=${appUrl}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
        res.redirect(url);
    } else if (state == 'weixin' && req.session.userID == undefined) {
        //  开始验证、未登录
        let code = req.query.code;
        //  ok
        if (code != undefined && isNaN(code)) {
            //  获取 access_token，通过 appid+appsecret+code
            let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appID}&secret=${appSecret}&code=${code}&grant_type=authorization_code`;
            utils.httpsGet(url, (code, data) => {
                if (!code) {
                    return res.redirect('/error')
                }
                data = JSON.parse(data);
                let accessToken = data.access_token, openID = data.openid;

                let userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openID}&lang=zh_CN`;
                utils.httpsGet(userInfoUrl, (code, data) => {
                    if (!code) {
                        return res.redirect('/error')
                    }
                    data = JSON.parse(data);
                    let nickName = data.nickname;
                    let headimgurl = data.headimgurl;
                    console.log(`一位用户登录成功,用户ID:${openID},用户名:${nickName},头像地址:${headimgurl}`);
                    req.session.userID = openID;
                    userM.edit({
                        userID: openID,
                        nickName: nickName,
                        portraitUrl: headimgurl
                    }, (code) => {
                        if (!code) {
                            return res.redirect('/error');
                        }
                        res.redirect('/')
                    });
                })
            })
        }
    } else {
        //  完整验证并登陆
        res.cookie('userID', req.session.userID);
        res.sendFile(path.resolve('client', 'dist', 'index.html'));
    }
})

//  返回一个非微信的普通页
router.get('/', (req, res, next) => {    
    if (serverConfig.debugMode) {
        req.session.userID = 'yuanwansong';
        res.cookie('userID', req.session.userID);
    }
    res.sendFile(path.resolve('client', 'dist', 'index.html'));
})

module.exports = router;