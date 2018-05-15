const barrageM = require('../model/barrage')
const userM = require('../model/user')
let io = undefined;

//  保证弹幕非即时相应，需要进入队列，每隔个时间段发出弹幕，避免屏幕同时出现大量弹幕
let taskQueue = [];
let taskTimeID = undefined;
const runTask = (task) => {
    if (taskTimeID == undefined) {
        taskTimeID = setInterval(() => {
            let task = taskQueue.shift();
            if (task != undefined) {
                io.sockets.emit('barrage', task);
            } else {
                clearInterval(taskTimeID);
                taskTimeID = undefined;
            }
        }, 150)
    }
}

const inTask = (task) => {
    taskQueue.push(task);
    runTask();
}

const init = (server) => {
    io = require('socket.io')(server);

    io.on('connection', (socket) => {
        socket.on('barrage', (data) => {
            userM.getPortraitUrl({ userID: data.userID }, (code, portraitUrl) => {
                if (!code) {
                    return;
                }

                let barrageInfo = {
                    barrageID: 'id-' + new Date().getTime(),
                    text: data.text,
                    userID: data.userID,
                    portraitUrl: portraitUrl
                };
                
                barrageM.insert({
                    userID: data.userID,
                    text: data.text
                }, (code, barrageID) => {
                    if (code) {
                        barrageInfo.barrageID = barrageID;
                    }
                    inTask(barrageInfo)
                });

            })
        });

        socket.on('disconnect', (reason) => {
            console.log(`websocket 断开一个连接,${reason}`)
        });
    });
}

module.exports = {
    init: init
}