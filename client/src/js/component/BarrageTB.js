import React, { Component } from 'react'
import Barrage from '@Component/Barrage'
import io from 'socket.io-client'
import styles from './Barrage.css'
import AppConfig from '@Config/client.config.js'
import defaultPortraitUrl from '../../images/portrait.jpg'

const socket = io(AppConfig.socketUrl, {
    transports: ['websocket']
})

//  弹幕背景颜色随机
function getBgColor() {
    let bgColors = ['red', 'orange', 'yellow', 'green', 'blue', 'cyan', 'purple'];
    return bgColors[parseInt(Math.random() * 7)];
}

//  获取弹幕的最终高度
function getBestTop(top) {
    let clientHeight = document.body.clientHeight - 100;
    return top % clientHeight
}

const getValueFromKey = function (str, key) {
    let res = str.match(new RegExp(`${key}=(.*?)(;|$)`));
    return res != null ? res[1] : undefined;
}

class BarrageTB extends Component {
    constructor() {
        super()
        this.state = {
            barranges: []
        }
        this.presentTop = 60;
        this.initLeft = undefined;
        this.barrageScheduleID = undefined;
    }

    //  发送弹幕（走服务器）
    sendBarrage = (text) => {
        this.clearBarrageSchedule();

        console.log('弹幕发送中......')
        socket.emit('barrage', {
            text,
            userID: getValueFromKey(document.cookie, 'userID')
        })
    }

    //  本地发送弹幕
    sendClientBarrage = () => {
        console.log('本地测试弹幕')
        this.getBarrage({
            barrageID: 'id-' + new Date().getTime(),
            text: '没弹幕多尴尬...我自己发一个吧...',
            userID: 'localTest',
            portraitUrl: defaultPortraitUrl
        })
    }

    removeBarrage = (barrageID) => {
        let oldBarranges = this.state.barranges.slice();
        let barranges = oldBarranges.filter((value) => {
            return value.barrageID != barrageID;
        })
        this.setState({ barranges })
    }

    runBarrageSchedule = () => {
        this.barrageScheduleID = setInterval(() => {
            this.sendClientBarrage();
        }, 3000);
    }

    clearBarrageSchedule = () => {
        this.barrageScheduleID != undefined
            && (clearInterval(this.barrageScheduleID), this.barrageScheduleID = undefined)
    }

    getBarrage = (data) => {
        let barranges = this.state.barranges.slice();
        barranges.push({
            barrageID: data.barrageID,
            text: data.text,
            bgColor: getBgColor(),
            top: getBestTop(this.presentTop),
            left: this.initLeft,
            portraitUrl: data.portraitUrl
        });
        //  弹幕高度相隔60
        this.presentTop += 60;
        this.setState({ barranges })
    }

    componentDidMount() {
        //  路由切换避免事件重复
        document.onvisibilitychange = null;
        document.onvisibilitychange = () => {
            if (document.visibilityState == "visible") {
                !this.barrageScheduleID && this.runBarrageSchedule();
            }
            if (document.visibilityState == "hidden") {
                this.clearBarrageSchedule();
            }
        }

        //  路由切换避免事件重复 
        socket.removeAllListeners()
        socket.on('barrage', (data) => {
            console.log('从服务器获取一条弹幕信息：')
            console.log(data);
            this.getBarrage(data)
        });

        this.initLeft = document.body.clientWidth;
        this.runBarrageSchedule();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.newBarrageText != '' && nextProps.newBarrageText != this.props.newBarrageText) {
            this.sendBarrage(nextProps.newBarrageText)
        }
    }

    componentWillUnmount() {
        this.clearBarrageSchedule();
    }

    render() {
        return (
            <div className={styles.wrapper}>
                {
                    this.state.barranges.map((barrange) => {
                        return <Barrage
                            id={barrange.barrageID}
                            key={barrange.barrageID}
                            text={barrange.text}
                            top={barrange.top}
                            left={barrange.left}
                            bgColor={barrange.bgColor}
                            portraitUrl={barrange.portraitUrl}
                            removeBarrage={this.removeBarrage}
                        />
                    })
                }
            </div>
        )
    }
}

export default BarrageTB