import React, { Component } from 'react'
import HotelAddress from '@Component/HotelAddress'
import BottomToolbar from '@Component/BottomToolbar'

const HotelMap = (props) => {
    return (
        <div>
            <HotelAddress />
            <BottomToolbar where="map" />
        </div>
    )
}

export default HotelMap;