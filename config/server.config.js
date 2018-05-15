let ServerConfig = {
    //  见微信开发文档：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842
    //  微信开发者测试号申请：https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login
    weixin: {
        //  微信公众号开发ID
        appID: '',
        //  微信公众号开发秘钥
        appSecret: '',
        //  页面授权类型
        scope: 'snsapi_userinfo',
        //  页面授权后的回掉地址
        callBackUrl: ''
    },
    //  服务器启动端口
    serverPort: 3000,
    //  数据库配置
    mysql: {
        host: '',
        user: '',
        password: '',
        port: '',
        database: ''
    },
    //  是否启用调试模式，开发模式true，生产模式建议false
    debugMode: true,
    //  每位用户每天最大抽奖次数限制
    localLotteryMax: 100
}

module.exports = ServerConfig