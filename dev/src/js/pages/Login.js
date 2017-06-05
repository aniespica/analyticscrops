import React, { PropTypes, Component } from "react"
import { connect } from "react-redux"
import * as user from '../actions/users'
import { browserHistory } from 'react-router'

//Components
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'

@connect((store)=>{
  return {
    fetching: store.user.fetching
  }
})
export default class Login extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {
		super()
		this.state = {}
	}

	componentDidMount(){
		//this.props.dispatch(user.logout(this))
	}

	componentDidUpdate() {
		if (this.props.fetching == true) {

			const pathname = this.context.router.location.pathname
			
			if (pathname === '/signin' || pathname === '/signup') {
				return this.context.router.push('/')
			}

			this.context.router.push(pathname)
			
		}
	}

	componentWillUnmount(){}

	render() {

		const { context } = this

		if (context.router.location.pathname == '/signup') {
			return (
				<div id="LoginWrapper"><SignupForm/></div>
			)
		}

		return (
			<div id="LoginWrapper"><LoginForm/></div>
		)

	}

	handleChangeForm(){}
	handleSing(e){
		e.preventDefault();
		this.props.dispatch(user.createUser(this.state));
	}


}