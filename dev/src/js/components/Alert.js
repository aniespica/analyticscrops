import React, { PropTypes, Component } from "react"


export default class Alert extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {super()}

	componentDidMount(){}

	componentDidUpdate() {}

	componentWillUnmount(){}

	render() {

		if (this.props.display) {
			return (
				<div id="Alert" class={this.props.type}>
					{this.title(this.props.title)}
					{this.description(this.props.description)}
				</div>
			)	
		}

		return null
		
	}

	title(t){
		if (!t || typeof t !== 'string') return null 
		return <div class="title">{t}</div>
	}
	description(d){
		if (!d || typeof d !== 'string') return null 
		return <div class="description">{d}</div>
	}


}