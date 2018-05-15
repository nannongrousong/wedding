import React, { Component } from 'react'
import LotteryCtrl from '@Component/LotteryCtrl'
import BottomToolbar from '@Component/BottomToolbar'

const LotteryFun = (props) => {
    return (
        <div>
            <LotteryCtrl />
            <BottomToolbar where="map" />
        </div>
    )
}

export default LotteryFun