import React, { Component } from 'react'
import TopInfo from '@Component/TopInfo'
import BarrageTB from '@Component/BarrageTB'
import BottomToolbar from '@Component/BottomToolbar'
import MainContent from '@Component/MainContent'

class AssemblyHall extends Component {
    constructor() {
        super();
        this.state = {
            showInfo: false,
            barrageText: ''
        }
    }

    switchShow = (status) => {
        this.setState({
            showInfo: (status != undefined) ? status : !this.state.showInfo
        })
    }

    sendBarrage = (text) => {        
        this.setState({
            barrageText: text
        })
    }

    render() {
        return (
            <div>
                <BarrageTB newBarrageText={this.state.barrageText} />
                <BottomToolbar switchShow={this.switchShow} sendBarrage={this.sendBarrage} />
                <MainContent />
                <TopInfo showInfo={this.state.showInfo} switchShow={this.switchShow} />
            </div>
        )
    }
}

export default AssemblyHall