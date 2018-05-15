const io = require('socket.io-client')

//最大50用户
const maxUsers = 100;
//每位用户输入间隔5s
const interVal = 5000;

const run = () => {
    for (let i = 0; i < maxUsers; i++) {
        const socket = io('http://localhost:3000', {
            transports: ['websocket']
        })

        socket.on('connect', () => {
            console.log('websock 有一个新连接...')
        });

        socket.on('disconnect', (reason) => {
            console.log(`websocket 断开一个连接,${reason}`)
        });

        setInterval(() => {
            socket.emit('barrage', {
                text: '用户test' + i + '发的负载测试弹幕' + new Date().getTime(),
                userID: 'test' + i
            })
        }, interVal)        
    }
}

run()



