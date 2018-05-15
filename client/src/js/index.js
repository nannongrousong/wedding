import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, Router, Route } from 'react-router-dom'
import AssemblyHall from '@Container/AssemblyHall'
import HotelMap from '@Container/HotelMap'
import BGMusic from '@Component/BGMusic'
import LotteryFun from '@Container/LotteryFun'

import '../styles/index.css'

const App = (props) => {
    return (
        <div>
            <BGMusic />
            <Switch>
                <Route exact path='/' component={AssemblyHall} />
                <Route path="/hotelmap" component={HotelMap} />
                <Route path="/lottery" component={LotteryFun} />
            </Switch>
        </div>
    )
}

ReactDOM.render((
    <HashRouter>
        <App />
    </HashRouter>
), document.getElementById('root'));