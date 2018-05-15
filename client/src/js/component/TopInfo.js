import React, { Component } from 'react';
import QueueAnim from 'rc-queue-anim';

import styles from './TopInfo.css'

class TopInfo extends Component {
    constructor() {
        super();
    }

    switchShow = () => {
        this.props.switchShow()
    }

    render() {
        let showInfo = this.props.showInfo;
        return (
            <div className={styles.wrapper}>
                <QueueAnim type={['bottom', 'left']}
                    ease={['easeOutQuart', 'easeInOutQuart']}>
                    {showInfo ? [
                        <div className={styles.content} key="a">
                            <h1>我们结婚啦</h1>
                            <p>两姓联姻，一堂缔约，良缘永结，匹配同称。</p>
                            <p>看此日桃花灼灼，宜室宜家，卜他年瓜瓞绵绵，尔昌尔炽。</p>
                            <p>谨以白头之约，书向鸿笺，好将红叶之盟，载明鸳谱。此证。</p>
                        </div>
                    ] : null}
                </QueueAnim>

                <div className={showInfo ? styles.hide : styles.show} onClick={this.switchShow}>
                    <div className={styles.line}></div>
                    <div className={styles.circle}>{showInfo ? 'x' : ''}</div>
                </div>
            </div>
        )
    }
}

export default TopInfo