import React, { PropTypes, Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from "react-redux"
import { logout } from '../actions/users'

/*Components*/
@connect((store)=>{
  return {
  		user: store.user.User,
  		fetching: store.user.Fetching,
   	error: store.user.Error
  }
})
export default class Headbar extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {
		super()
		this.state = {}
	}

	componentDidMount(){
		if (!localStorage["firebase:authUser:"+utils.apiKey+":[DEFAULT]"]) {
			this.context.router.push('/signin')
		}
	}

	componentDidUpdate() {
		if (!localStorage["firebase:authUser:"+utils.apiKey+":[DEFAULT]"]) {
			utils.hideSpinner()
			this.context.router.push('/signin')
		}
	}

	render() {

		return (
			<div id='Headbar'>
				<div>
					<figure>
						<img src='/img/logo.svg'/>
					</figure>
				</div>
				<div role='profile' onClick={this.logout.bind(this)}>
					<figure>
						<img src='/img/profile.png'/>
					</figure>
				</div>
			</div>
		)

	}

	logout() {

		this.props.dispatch(logout())

		utils.showSpinner()

	}


}