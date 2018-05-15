import React, { Component } from 'react'
import { Toast, Modal } from 'antd-mobile';
import styles from './LotteryCtrl.css'
import FontAwesome from 'react-fontawesome';
import fetch from 'isomorphic-fetch'

const LotteryTrayItem = (props) => {
    const index = props.index;
    const awardList = props.list;
    const count = awardList.length;
    const awardName = awardList[index].name;
    const awardIcon = awardList[index].icon;
    const lineDeg = -360 / count / 2 + (360 / count) * (index - 1);
    const awardDeg = -360 / count * index;

    return (
        <div>
            <div className={styles.line} style={{ transform: `rotate(${lineDeg}deg)` }}></div>
            <div className={styles.award} style={{ transform: `rotate(${awardDeg}deg)` }}>
                <FontAwesome name={awardIcon} className={styles.myicon} />
                <span className={styles.describe}>{awardName}</span>
            </div>
        </div>
    )
}

const LotteryTrayItemList = (props) => {
    const awardList = props.awardList;
    return awardList.map((award, index, list) => {
        return <LotteryTrayItem index={index} list={list} key={index} />
    })
}

class Lottery extends Component {
    constructor() {
        super();
        this.state = {
            awardStyle: undefined,
            awardList: []
        }
    }

    componentDidMount() {
        fetch('/award')
            .then((res) => res.json())
            .then((res) => {
                if (!res.code) {
                    return Toast.fail(res.info);
                }

                let lastShowAwards = [];
                res.data.forEach((value) => {
                    lastShowAwards.push({
                        name: value.name,
                        icon: value.icon
                    });
                    lastShowAwards.push({
                        name: '谢谢参与',
                        icon: 'smile-o'
                    })
                })
                this.setState({
                    awardList: lastShowAwards
                })
            })
    }

    startLottery = () => {
        this.setState({
            awardStyle: undefined
        }, () => {
            fetch('/award/record', {
                credentials: 'include'
            }).then(res => res.json())
                .then(res => {
                    if (!res.code) {
                        return Toast.fail(res.info);
                    }
                    if (!res.data.canLottery) {
                        Toast.info('今天的抽奖次数用完啦，请明天再来吧！', 3);
                    } else {
                        fetch('/award/lottery', {
                            credentials: 'include'
                        })
                            .then(res => res.json())
                            .then(res => {
                                if (!res.code) {
                                    Toast.fail(res.info);
                                    return;
                                }
                                console.log('我要转转：' + res.data.deg);
                                localStorage.setItem('award', JSON.stringify(res.data.award));
                                const lastDeg = 360 * 10 + res.data.deg;
                                this.setState({
                                    awardStyle: {
                                        transform: `rotate(${lastDeg}deg)`,
                                        transition: 'transform 10s ease'
                                    }
                                })
                            })
                    }
                })
        })
    }

    endCircle = () => {
        let awardStr = localStorage.getItem('award');
        localStorage.removeItem('award');

        let awardName = '', recordID = '';
        if (awardStr != undefined) {
            let awardInfo = JSON.parse(awardStr)
            recordID = awardInfo.recordID;
            awardName = awardInfo.name;
        }

        if (recordID != undefined && recordID != '') {
            const promptDg = Modal.prompt('恭喜您，中奖啦', `${awardName}`, [
                {
                    text: '关闭',
                    onPress: () => new Promise((resolve, reject) => {
                        Modal.alert('信息', '这么大的红包您就这么放弃了？', [
                            {
                                text: '我放弃！',
                                onPress: () => {
                                    promptDg.close();
                                }
                            },
                            {
                                text: '手抖点错啦！'
                            }
                        ])
                    })
                },
                {
                    text: '提交',
                    onPress: (value) => new Promise((resolve, reject) => {
                        if (! /^1[0-9]{10}$/.test(value)) {
                            Toast.info('请输入正确的手机号！')
                        } else {
                            fetch('/award/mark', {
                                method: 'post',
                                headers: new Headers({
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }),
                                body: `mark1=${value}&recordID=${recordID}`
                            }).then(res => res.json())
                                .then(res => {
                                    if (!res.code) {
                                        Toast.fail(res.info);
                                        return;
                                    }
                                    Toast.success('提交成功！预计三天日完成奖品发放！', 3, () => {
                                        promptDg.close();
                                    });
                                })
                        }
                    })
                }
            ], 'default', '', ['请输入手机号码'])
        } else {
            Toast.offline('好可惜，再试试吧...')
        }
    }

    render() {
        return (
            <div className={styles.tray}>
                <div className={styles['circle-small']}>
                    <div className={styles.square}></div>
                    <span className={styles.startBtn} onClick={this.startLottery}>抽奖</span>
                </div>


                <div className={styles['circle-big']} style={this.state.awardStyle} onTransitionEnd={this.endCircle}
                    ref={(tray) => this.lotteryTray = tray} >
                    <LotteryTrayItemList awardList={this.state.awardList} />
                </div>
            </div>
        )
    }
}

export default Lottery;