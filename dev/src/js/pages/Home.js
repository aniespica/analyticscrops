import React, { PropTypes, Component } from "react"
import { browserHistory } from 'react-router'


export default class Home extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {
		super()
		this.state = {}
	}

	componentDidMount(){}

	componentDidUpdate() {}

	componentWillUnmount(){}

	render() {

		return (
			<div id="mainContent">
				
			</div>
		)

	}


}