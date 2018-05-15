const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const session = require('express-session')
const serverConfig = require('../config/server.config')
const bodyParser = require('body-parser');
const compression = require('compression')
const cookieParser = require('cookie-parser');
const indexRouter = require('./routers/index')
const awardRouter = require('./routers/award')
const signRouter = require('./routers/sign')
const barrageWebsocket = require('./routers/barrageWS')
const log4js = require('./common/log4js')
const { appID, appSecret, scope, callBackUrl } = serverConfig.weixin;

// gzip压缩
app.use(compression());
app.use(express.static(path.resolve('client/dist'), { index: '_' }));
//  解析form post数据
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
//  session
app.use(session({
    name: 'sessionID',
    secret: 'abcdefg',
    // 不自动保存未初始化的会话
    saveUninitialized: false,
    // 不每次都重新保存会话
    resave: true,
    cookie: {
        maxAge: 3600 * 1000,
        secure: false
    }
}));

server.listen(serverConfig.serverPort, () => {
    console.log(`正在监听${serverConfig.serverPort}端口`);
});

//  初始化log4js
log4js.init(app);

//  弹幕websocket
barrageWebsocket.init(server)

//  主页面路由
app.use('/', indexRouter)
//  签到路由
app.use('/sign', signRouter)
//  奖品路由
app.use('/award', awardRouter);

//错误页
app.get('/error', (req, res, next) => {
    console.error('内部服务器错误[内部跳转]');
    res.send('')
})
//  404
app.use((req, res) => {
    res.status(404)
    res.send('页面不存在！')
})

// 50x
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.send('内部服务器错误')
})