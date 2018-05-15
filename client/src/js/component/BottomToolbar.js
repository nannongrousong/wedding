import React, { Component } from 'react'
import { Flex, Button, ActionSheet, Toast } from 'antd-mobile';
import FontAwesome from 'react-fontawesome';
import styles from './BottomToolbar.css'
import fetch from 'isomorphic-fetch'

class BottomToolbar extends Component {
    constructor() {
        super()
        this.state = {
            barrageMode: false,
            barrageText: ''
        }
    }

    sign = () => {
        fetch('/sign', {
            credentials: 'include'
        }).then(res => res.json())
            .then((res) => {
                if (!res.code) {
                    return Toast.fail(res.info);
                }

                let signState = res.data.signState;
                ActionSheet.showActionSheetWithOptions({
                    options: ['我必须去', '我来不了', '我在现场', '取消'],
                    cancelButtonIndex: 3,
                    destructiveButtonIndex: signState,
                    maskClosable: true
                }, (btnIndex) => {
                    if (btnIndex == 3) {
                        return;
                    }
                    fetch('/sign', {
                        credentials: 'include',
                        method: 'post',
                        headers: new Headers({
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }),
                        body: 'signState=' + btnIndex
                    }).then((res) => res.json())
                        .then(res => {
                            if (!res.code) {
                                Toast.fail(res.info);
                            }
                        })
                })
            })
    }

    congratulation = () => {
        this.setState({
            barrageMode: true
        })
        this.props.switchShow(false)
    }

    showMap = () => {
        window.location.replace("#/hotelmap")
    }

    lottery = () => {
        window.location.replace("#/lottery")
    }

    showButtons = () => {
        this.setState({
            barrageMode: false
        })
    }
    sendBarrage = () => {
        this.props.sendBarrage(this.state.barrageText)
        this.setState({
            barrageText: ''
        })
    }

    jumpHome = () => {
        window.location.replace("#/")
    }

    updateBarrageText = (e) => {
        this.setState({
            barrageText: e.target.value
        })
    }

    render() {
        const { where } = this.props;
        const { barrageMode } = this.state;
        return (
            <div className={styles.wrapper} >
                <div className={!barrageMode ? styles.buttons : styles.hidden}>
                    <Flex className={`${where == 'map' ? styles.hidden : ''}`}>
                        <Flex.Item>
                            <Button className={styles['lottery-button']} onClick={this.lottery} size="small">
                                <FontAwesome name='gift' className={styles['button-icon']} />
                                抽奖
                            </Button>
                        </Flex.Item>
                        <Flex.Item>
                            <Button className={styles['sign-button']} onClick={this.sign} size="small">
                                <FontAwesome name='hand-peace-o' className={styles['button-icon']} />
                                签到
                            </Button>
                        </Flex.Item>
                        <Flex.Item>
                            <Button className={styles['congra-button']} onClick={this.congratulation} size="small">
                                <FontAwesome name='heart' className={styles['button-icon']} />
                                祝福
                            </Button>
                        </Flex.Item>
                        <Flex.Item>
                            <Button className={styles['map-button']} onClick={this.showMap} size="small">
                                <FontAwesome name='map-marker' className={styles['button-icon']} />
                                地图
                            </Button>
                        </Flex.Item>
                    </Flex>
                    <Flex className={`${where == 'map' ? '' : styles.hidden}`}>
                        <Flex.Item>
                            <Button className={styles['return-button']} onClick={this.jumpHome} size="small">
                                <FontAwesome name='reply-all' className={styles['button-icon']} />
                                返回
                            </Button>
                        </Flex.Item>
                    </Flex>
                </div>
                <div className={!barrageMode ? styles.hidden : styles['barrage-input-area']}>
                    <FontAwesome name='navicon' className={styles['switch-button']} onClick={this.showButtons} />
                    <input value={this.state.barrageText} className={styles['barrage-input']} placeholder="搞这玩意儿能找到女朋友吗？" onChange={this.updateBarrageText} />
                    <FontAwesome name='arrow-circle-right' className={styles['send-barrage']} onClick={this.sendBarrage} />
                </div>
            </div>
        )
    }
}

export default BottomToolbar