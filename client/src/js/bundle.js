//  按需加载模块。但对于CSS加载有bug....，暂时没用吧......
//  https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/456

import React, { Component } from 'react'

export default class Bundle extends React.Component {

    state = {
        // short for "module" but that's a keyword in js, so "mod"
        mod: null
    }

    componentWillMount() {
        this.load(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.load !== this.props.load) {
            this.load(nextProps)
        }
    }

    load(props) {
        this.setState({
            mod: null
        })
        props.load((mod) => {
            this.setState({
                // handle both es imports and cjs
                mod: mod.default ? mod.default : mod
            })
        })
    }

    render() {
        if (!this.state.mod)
            return false
        return this.props.children(this.state.mod)
    }
}