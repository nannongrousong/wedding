import React, { Component } from 'react'
import ReactDom from 'react-dom'
import styles from './Barrage.css'

class Barrage extends Component {
    constructor() {
        super();

        this.state = {
            transform: undefined,
            transition: undefined
        }
    }

    componentDidMount() {
        let initLeft = this.props.left;
        let xEnd = (initLeft + 400) * -1;

        const tempTimeID = setTimeout(() => {
            clearTimeout(tempTimeID);
            this.setState({
                transform: `translateX(${xEnd}px)`
            })
        }, 10);
    }

    barrageEnd = () => {
        this.props.removeBarrage(this.props.id);
    }

    render() {
        const { left, top } = this.props;
        return (<div
            style={{ left, top, transform: this.state.transform }}
            className={styles.barrage}
            onTransitionEnd={this.barrageEnd} >
            <img className={styles.portrait} src={this.props.portraitUrl} />
            <span className={styles.content} style={{ backgroundColor: this.props.bgColor }} > {this.props.text} </span>
        </div>
        )
    }
}

export default Barrage