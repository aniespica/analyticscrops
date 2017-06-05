import React, { PropTypes, Component } from "react"
import { browserHistory, Link, IndexLink } from "react-router"
import { createUser } from '../actions/users'
import { connect } from "react-redux"

import Alert from './Alert'

@connect((store)=>{
  return {
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
			Email:'',
			Password:'',
			FirstName:'',
			LastName:'',
			Company:'',
			Phone:'',
			Title:'',
			message:''
		}
	}

	componentDidMount(){
		if (localStorage["firebase:authUser:"+utils.apiKey+":[DEFAULT]"]) {
			this.context.router.push('/')
		}
	}

	componentDidUpdate() {

	}

	componentWillUnmount(){}

	render() {

		const m = this.state.message
		utils.hideSpinner()
		if (this.props.error) {
			
			this.state.message = this.props.error.message
		}else{
			this.state.message = m
		}

		const {FirstName, LastName, Company, Phone, Title, Email, Password, message} = this.state

		return (
			<center>
				<div class='max-width180'>
					<img src='/img/logo2.svg'/>
				</div>
				<div class={'box color-gray' + (typeof this.props.fetching === 'string' ? ' disabled' : '')}>
					<form onSubmit={this.handleSubmit.bind(this)}>
						<label>Nombre*</label>
						<input type='text' data-type='signup' name='FirstName' value={FirstName} onChange={utils.onChange.bind(this)}/>
						<label>Apellido*</label>
						<input type='text'data-type='signup' name='LastName' value={LastName} onChange={utils.onChange.bind(this)}/>
						<label>Email*</label>
						<input type='text'data-type='signup' name='Email' value={Email} onChange={utils.onChange.bind(this)}/>
						<label>Contraseña*</label>
						<input type='password'data-type='signup' name='Password' value={Password} onChange={utils.onChange.bind(this)}/>
						<label>Compañia*</label>
						<input type='text'data-type='signup' name='Company' value={Company} onChange={utils.onChange.bind(this)}/>
						<label>Telefono</label>
						<input type='number' min='0'data-type='signup' name='Phone' value={Phone} onChange={utils.onChange.bind(this)}/>
						<label>Cargo</label>
						<input type='text'data-type='signup' name='Title' value={Title} onChange={utils.onChange.bind(this)}/>
						<span class="message">{this.state.message}</span>
						<input type='submit' value='Registar'/>
					</form>
					<div class="box-button">
						<span>¿Tienes una cuenta?</span> <Link to="/signin">Ingresa</Link>
					</div>
				</div>
				<Alert
					display={typeof this.props.fetching === 'string' ? true : false} 
					type="success"
					description={this.props.fetching}
				/>
			</center>
		)
	}

	handleSubmit(e){
		e.preventDefault()
		const {FirstName, LastName, Company, Phone, Title, Email, Password} = this.state

		utils.showSpinner()
		document.querySelectorAll('[data-type="signup"]').forEach(function(el) {
			if (el.defaultValue) return el.style['border-color'] = '#dcdcdc'
		});

		if (!FirstName || !LastName || !Company || !Email || !Password ) {
			document.querySelectorAll('[data-type="signup"]').forEach(function(el) {
				if (!el.defaultValue && el.name != 'Phone' && el.name != 'Title') return el.style['border-color'] = 'red'
			});
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
			Password: Password.trim(),
			FirstName: FirstName.trim(),
			LastName: LastName.trim(),
			Company: Company.trim(),
			Phone: Phone.trim(),
			Title: Title.trim()
		}

		this.props.dispatch(createUser(user))

	}


}