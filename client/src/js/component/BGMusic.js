import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome';

import styles from './BGMusic.css'

class BGMusic extends Component {
    constructor() {
        super();
        this.state = {
            musicOn: true
        }
        this.musicIndex = 0;
    }

    componentDidMount = () => {
        this.musics = [require('../../music/beautiful.mp3'), require('../../music/choose.mp3'), require('../../music/cryonmyshoulder.mp3')];

        let userAgent = window.navigator.userAgent;

        if (userAgent.includes('MicroMessenger')) {
            //  在微信浏览器下
            document.addEventListener("WeixinJSBridgeReady", () => {
                this.audio.src = this.musics[this.musicIndex % 3];
                this.audio.load();
                this.audio.play();
                this.musicIndex++;
            }, false);
        } else  {
            //  不支持自动播放
            this.setState({
                musicOn: false
            })
        }
    }

    controlMusic = () => {
        let isPaused = this.audio.paused;
        !this.audio.src && (this.audio.src = this.musics[this.musicIndex])
        isPaused ? this.audio.play() : this.audio.pause();
        this.setState({
            musicOn: isPaused
        })
    }

    playNextMusic = () => {
        this.audio.src = this.musics[this.musicIndex % 3];
        this.audio.load();
        this.audio.play();
        this.musicIndex++;
    }

    render() {
        let musicOn = this.state.musicOn;
        return (
            <div className={styles.wrapper} onClick={this.controlMusic}>
                <FontAwesome
                    name={`${musicOn ? 'volume-up' : 'volume-off'}`}
                    className={styles.icon}
                />
                <audio preload="true" controls={false} loop={false} onEnded={this.playNextMusic}
                    ref={(audio) => { this.audio = audio }} >
                </audio>
            </div>
        )
    }
}

export default BGMusic
