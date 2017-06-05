import React, { PropTypes, Component } from "react"
import { browserHistory } from 'react-router'
import { connect } from "react-redux"
import AlertContainer from 'react-alert';

import * as user from '../actions/users'
import Form from '../components/Forms'
import Table from '../components/Table'
import ListViewHeader from '../components/ListViewHeader'


@connect((store)=>{
	return {
		Crop: store.crop.Crop,
		Users: store.user.Users,
		User: store.user.User,
		Profiles: store.user.Profiles,
		Error: store.user.Error,
		Fetching: store.user.Fetching
	}
})
export default class Crops extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {
		super()
		
		this.state = {
			Title: 'Usuarios',
			Titles:['Nombre',
				'Email',
				'Perfil',
				'Ocupacion'
			],
			RowsTitles:[
				'Email',
				'Profile',
				'Title'
			],
			Sections: []
		}

		this.alertOptions = {
	      offset: 14,
	      position: 'top right',
	      theme: 'light',
	      time:0,
	      transition: 'scale'
	    };
	}

	componentDidMount(){}

	componentDidUpdate() {

		if (this.props.Error && typeof this.props.Error === 'object') {
			 this.msg.error(this.props.Error.message);
		}

		if (this.props.Fetching && typeof this.props.Fetching === 'string') {
			this.msg.success(this.props.Fetching);
			document.getElementById('formContainer').style.display = 'none'
			document.getElementById('backgroundForm').style.display = 'none'
		}
	}

	componentWillUnmount(){}

	componentWillMount(){
		this.props.dispatch(user.readUsers(this.props.User))

		const self = this

		this.setState({Sections: [{
				Title:"Informacion",
				Columns:[[{
					Label:'Nombre',
					Name:'FirstName',
					Value: '',
					Type: 'text',
					Required:false
				},
				{
					Label:'Apellido',
					Name:'LastName',
					Value: '',
					Type: 'text',
					Required:true
				}],
				[{
					Label:'Perfil',
					Name:'Profile',
					Value: self.props.Profiles,
					Type: 'text',
					Required:true
				},
				{
					Label:'Ocupacion',
					Name:'Title',
					Value: '',
					Type: 'text',
					Required:false
				}],
				[{
					Label:'Telefono',
					Name:'Phone',
					Value: '',
					Type: 'text',
					Required:false
				},{
					Label:'Email',
					Name:'Email',
					Value: '',
					Type: 'text',
					Required:true
				}],[{
					Label:'Contraseña',
					Name:'Password',
					Value: '',
					Type: 'password',
					Required:true
				}]]
			}]})
	}

	render() {

		const self = this
		
		return (
			<div id="CropContent">
				<div class="headerTitle">
					<ListViewHeader Title={this.state.Title} buttons={[{title:'Nuevo'}]}/>
				</div>
				<Table RowsTitles={this.state.RowsTitles} Rows={this.props.Users} Small={3} Medium={5} Large={5} Titles={this.state.Titles} onClick={this.getCrop.bind(this)}/>
				<Form Title='Añadir Usuario' id="1" onSubmit={this.addUser.bind(this)} sections={this.state.Sections} />
				<AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
			</div>
		)

	}

	getCrop(e){}

	addUser(e){
		e.preventDefault()

		const newUser = {
			FirstName: document.querySelector('[name="FirstName"]').value.trim(),
			LastName: document.querySelector('[name="LastName"]').value.trim(),
			Email: document.querySelector('[name="Email"]').value.trim(),
			Phone: document.querySelector('[name="Phone"]').value.trim(),
			Title: document.querySelector('[name="Title"]').value.trim(),
			Profile: document.querySelector('[name="Profile"]').value.trim(),
			Password: document.querySelector('[name="Password"]').value.trim()
		}
		
		if (!newUser.LastName || !newUser.Email || !newUser.Password || !newUser.Profile) {
			return 
		}

		this.props.dispatch(user.setUser(this.props.User, newUser))

	}


}