import React, { Component } from 'react'
import { Map, Marker, NavigationControl, InfoWindow } from 'react-bmap';
import styles from './HotelAddress.css'
import AppConfig from '@Config/client.config'
const hotelLocation = AppConfig.hotelLocation

const HotelAddress = (props) => (
    <div className={styles.wrapper}>
        <Map style={{ height: '100%' }} center={hotelLocation} zoom="14" >
            <Marker position={hotelLocation} />
            <InfoWindow position={hotelLocation} text="哈哈哈" title="我们结婚啦~" />
        </Map>
    </div>
)


export default HotelAddress