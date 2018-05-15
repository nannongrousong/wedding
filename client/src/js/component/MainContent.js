import React, { Component } from 'react'
import styles from './MainContent.css'

class MainContent extends Component {
    constructor() {        
        super();
        let width = document.body.clientWidth;
        let imgs = [];
        for (let i = 0; i < 10; i++) {
            try {
                let tmp = undefined;
                if(width > 500) {
                    tmp = require(`../../images/width${i}.jpg`);
                } else {
                    tmp = require(`../../images/${i}.jpg`);
                }                
                tmp && imgs.push(tmp);
            } catch (e) {
                continue; 
            }
        }
        this.imgs = imgs.slice();
        this.state = {
            imgStyle: {
                backgroundImage: `url(${this.imgs[0]})`
            }
        }
    }

    componentDidMount() {
        this.timeID = setInterval(() => {
            this.setState({
                imgStyle: {
                    backgroundImage: `url(${this.imgs[parseInt(Math.random() * this.imgs.length)]})`
                }
            })
        }, 30000)
    }

    componentWillUnmount() {
        clearInterval(this.timeID)
    }

    render() {
        return (
            <div className={styles.content} style={this.state.imgStyle}></div>
        )
    }
}

export default MainContent