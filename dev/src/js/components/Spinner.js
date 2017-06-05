import React, { PropTypes, Component } from "react"


export default class Spinner extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {super()}

	componentDidMount(){}

	componentDidUpdate() {}

	componentWillUnmount(){}

	render() {

		var style = {}
		if (this.props.display) {
			style.display = 'block'
		}

		return (
			<div id="Spinner" style={style}>loading</div>
		)
	}


}