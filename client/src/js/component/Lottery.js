//  这边才是真正的手动抽奖，不受概率控制，未上线。

import React, { Component } from 'react'
import styles from './Lottery.css'
import FontAwesome from 'react-fontawesome';

const LotteryTrayItem = (props) => {
    const index = props.index;
    const awardList = props.list;
    const count = awardList.length;
    const awardName = awardList[index].name;
    const awardIcon = awardList[index].icon;
    const awardDeg = -360 / count / 2 + (360 / count) * (index - 1);
    const lineDeg = -360 / count * index;

    return (
        <div>
            <div className={styles.line} style={{ transform: `rotate(${awardDeg}deg)` }}></div>
            <div className={styles.award} style={{ transform: `rotate(${lineDeg}deg)` }}>
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
            lotteryIng: false
        }
        this.awards = [{ name: '电脑', icon: 'laptop' }, { name: '谢谢参与', icon: 'smile-o' },
        { name: '手机', icon: 'mobile-phone' }, { name: '谢谢参与', icon: 'smile-o' },
        { name: '耳机', icon: 'headphones' }, { name: '谢谢参与', icon: 'smile-o' },
        { name: '音响', icon: 'podcast' }, { name: '谢谢参与', icon: 'smile-o' }];
    }

    startLottery = () => {
        this.setState({
            lotteryIng: true
        })
    }

    stopLottery = () => {
        this.setState({
            lotteryIng: false
        }, () => {
            //  matrix(0.866025, -0.5, 0.5, 0.866025, 0, 0)
            //  matrix(cosθ,sinθ,-sinθ,cosθ,0,0)
            let matrix = window.getComputedStyle(this.lotteryTray, null)['transform'];
            let sinVal = parseFloat(matrix.split(',')[1]);
            let cosVal = parseFloat(matrix.split(',')[3]);

            // 转盘转过的度数
            let computeDeg = Math.asin(sinVal) * 180 / Math.PI;
            let realDeg = 0;
            if (sinVal <= 0 && cosVal <= 0) {
                //[-180,-90]
                realDeg = -180 - computeDeg
            } else if (sinVal <= 0 && cosVal >= 0) {
                //[-90,0]
                realDeg = computeDeg
            } else if (sinVal >= 0 && cosVal >= 0) {
                //[0,90]
                realDeg = computeDeg
            } else {
                //[90,180]
                realDeg = 180 - computeDeg
            }

            if (realDeg < 0) {
                realDeg += 360
            }

            //  x ∈ [circle/2 * (2*index-1), circle/2 * (2*index+1) ]
            //  ==> index ∈ [(x-circle/2)/circle,(x+circle/2)/circle]
            let count = this.awards.length;
            let circle = 360 / count;

            let minX = (realDeg - circle / 2) / circle;
            let maxX = (realDeg + circle / 2) / circle;

            let award = this.awards[Math.floor(maxX) % count];
            console.log(`奖品是....`);
            console.log(award)
        })
    }

    render() {
        return (
            <div>
                <button onClick={this.startLottery}>开始抽奖</button>
                <button onClick={this.stopLottery}>停止抽奖</button>

                <div className={styles.tray}>
                    <div className={styles['circle-small']}>
                        <div className={styles.square}></div>
                    </div>

                    <div ref={(tray) => this.lotteryTray = tray} className={styles['circle-big'] + ' ' + (this.state.lotteryIng ? styles.run : styles.stop)}>
                        <LotteryTrayItemList awardList={this.awards} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Lottery;