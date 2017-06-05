import React, { PropTypes, Component } from 'react';
import { Link, browserHistory } from 'react-router';

export default class TopicMenu extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {
		super()
		this.state = {}
	}

	render() {

		const {label, icon, options, path} = this.props

		if (path) {
			return (
				<Link to={path} role='navElement'>
					<div role='icon' title='manage users' data-icon={icon}></div>
					<div role='barElement' href='#'>
						<div class='contentElement'>
							<label>{label}</label>
						</div>
					</div>
					<div class='navList'>{this.getOptions(options)}</div>	
				</Link>
			)
		}

		return (
			<div role='navElement' onClick={this.diggleMenuForElement.bind(this)}>
				<div role='icon' title='manage users' data-icon={icon}></div>
				<div role='barElement' href='#'>
					<div class='contentElement'>
						<label>{label}</label>
					</div>
				</div>
				<div class='navList'>{this.getOptions(options)}</div>	
			</div>
		)

	}

	getOptions(o=[]){
		//o means options
		if (Array.isArray(o)) {
			var nodeO = o.map(function(e, i){
				return (
					<Link to={e.path} key={i} role='barElement'>
						<div class='contentElement'>
							<label>{e.label}</label>
						</div>
					</Link>
				)
			})
			return nodeO
		}

		return null
	}

	diggleMenuForElement(e){

		if (e.target.parentElement.parentElement.tagName === 'A' || e.target.tagName === 'A') {
			if(window.innerWidth < 640){
				document.getElementById('NavIcon').children[0].dataset.icon = 'th-small'
				document.getElementById('NavBar').style.width = '60px'
				document.querySelectorAll('[role="navElement"]').forEach(function(e){
					return e.style.height = "60px"
				})
			}

			return 
		}

		if (e.target.parentElement.parentElement.parentElement.style.height === 'auto') {
			return e.target.parentElement.parentElement.parentElement.style.height = '60px'			
		}

		if (document.getElementById('NavIcon').children[0].dataset.icon === 'th-small') {
			document.getElementById('NavIcon').children[0].dataset.icon = 'th-large'
			document.getElementById('NavBar').style.width = '100%'
		}

		e.target.parentElement.parentElement.parentElement.style.height = 'auto'

	}


}