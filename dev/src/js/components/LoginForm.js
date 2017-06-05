import React, { PropTypes, Component } from "react"
import { browserHistory, Link, IndexLink } from "react-router"
import { login } from '../actions/users'
import { connect } from "react-redux"

@connect((store)=>{
  return {
  		user: store.user.User,
  		fetching: store.user.Fetching,
   	error: store.user.Error
  }
})
export default class Login extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {
		super()
		this.state = {
			Password: "",
			Email: "",
			message: "",
		}
	}

	componentDidMount(){
		if (localStorage["firebase:authUser:"+utils.apiKey+":[DEFAULT]"]) {
			this.context.router.push('/')
		}
	}

	componentDidUpdate() {
		if (localStorage["firebase:authUser:"+utils.apiKey+":[DEFAULT]"]) {
			utils.hideSpinner()
			this.context.router.push('/')
		}
	}

	componentWillUnmount(){}

	render() {

		const m = this.state.message
		if (this.props.error) {
			utils.hideSpinner()
			this.state.message = this.props.error.message
		}else{
			this.state.message = m
		}

		const {Password, Email, message} = this.state

		return (
			<center>
				<div class='max-width180'>
					<img src='/img/logo2.svg'/>
				</div>
				<div class='box color-gray'>
					<form onSubmit={this.handleSubmit.bind(this)}>
						<label>Username</label>
						<input type='text' data-type="login" name='Email' value={Email} onChange={utils.onChange.bind(this)}/>
						<label>Contraseña</label>
						<input type='password' data-type="login" name='Password' value={Password} onChange={utils.onChange.bind(this)}/>
						<span class="message">{message}</span>
						<input type='submit' value='Log In'/>
					</form>
					<div class="box-button">
						<span>¿No tienes cuenta?</span> <Link to="/signup">Registrate</Link>
					</div>
				</div>
			</center>
		)
	}

	handleSubmit(e){
		e.preventDefault()
		const {Email, Password} = this.state

		utils.showSpinner()
		var dataTypeLogin = document.querySelectorAll('[data-type="login"]');
		for(var i = 0; i < dataTypeLogin.length; i++) {
			if (dataTypeLogin.defaultValue) dataTypeLogin.style['border-color'] = '#dcdcdc';
		}
		// document.querySelectorAll('[data-type="login"]').forEach(function(el) {
		// 	if (el.defaultValue) return el.style['border-color'] = '#dcdcdc'
		// });

		if (!Email || !Password ) {
			for(var i = 0; i < dataTypeLogin.length; i++) {
				if (dataTypeLogin.defaultValue) dataTypeLogin.style['border-color'] = '#dcdcdc';
			}
			// document.querySelectorAll('[data-type="login"]').forEach(function(el) {
			// 	if (!el.defaultValue) return el.style['border-color'] = 'red'
			// });
			utils.hideSpinner()
			return this.setState({message:"Los campos en rojo son requeridos"})
		}

		if (!utils.isValidEmail(Email)) {
			document.querySelector('[name="Email"]').style['border-color'] = 'red'
			utils.hideSpinner()
			return this.setState({message:"El nombre de usuario no es correcto"})
		}

		if (Password.length < 6) {
			document.querySelector('[name="Password"]').style['border-color'] = 'red'
			utils.hideSpinner()
			return this.setState({message:"La contraseña no es valida"})
		}

		var user = {
			Email: Email.trim(),
			Password: Password.trim()
		}

		this.props.dispatch(login(user))

	}


}