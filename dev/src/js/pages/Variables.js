import React, { PropTypes, Component } from "react"
import { browserHistory } from 'react-router'
import { connect } from "react-redux"

import * as user from '../actions/users'
import * as crop from '../actions/crops'
import Form from '../components/Forms'
import Table from '../components/Table'
import ListViewHeader from '../components/ListViewHeader'

@connect((store)=>{
	return {
		Crop: store.crop.Crop,
		Users: store.user.Users,
		User: store.user.User,
		Variables: store.crop.Variables,
		Fetching: store.crop.Fetching
	}
})
export default class Variables extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {
		super()
		this.state = {
			Title: 'Variables',
			Titles:['Nombre',
				'Nombre en API',
				'Maximo Valor',
				'Minimo Valor',
				'Formula'
			],
			RowsTitles:[
				'Id',
				'Min',
				'Max',
				'Formula'
			],
			Sections: [{
				Title:"Informacion",
				Columns:[[{
					Label:'Nombre',
					Name:'Name',
					Value: '',
					Type: 'text'
				},{
					Label:'Formula',
					Name:'Formula',
					Value: '',
					Type: 'text'
				}],
				[{
					Label:'Minimo Valor',
					Name:'Min',
					Value: 0,
					Type: 'number'
				},
				{
					Label:'Maximo Valor',
					Name:'Max',
					Value: 100,
					Type: 'number'
				}],
				[{
					Label:'Unidad de Medida',
					Name:'UnitName',
					Value: 'Metros',
					Type: 'text'
				},
				{
					Label:'Simbolo de unidad de Medida',
					Name:'UnitSymbol',
					Value: 'm',
					Type: 'text'
				}],
				[{
					Label:'Es modificable',
					Name:'isModify',
					Value: false,
					Type: 'checkbox'
				},
				{
					Label:'Es sensor',
					Name:'Sensor',
					Value: false,
					Type: 'checkbox'
				}]]
			}]
		}
	}

	componentDidMount(){
		this.props.dispatch(crop.readVariables(this.props.User))
	}

	componentDidUpdate() {}

	componentWillUnmount(){}

	componentWillMount(){}

	render() {

		const self = this
		const {Variables} = this.props

		return (
			<div id="CropContent">
				<div class="headerTitle">
					<ListViewHeader Title={this.state.Title} buttons={[{title:'Nuevo'}]}/>
				</div>
				
				<Table trash={this.trash.bind(this)} link={false} RowsTitles={this.state.RowsTitles} Rows={Variables} Small={3} Medium={6} Large={6} Titles={this.state.Titles} onClick={this.getCrop.bind(this)}/>
				<Form Title='Añadir Variable' id='1' onSubmit={this.createCrop.bind(this)} sections={this.state.Sections} />
				
			</div>
		)

	}

	trash(e){
		var name = e.target.dataset.name
		if (name.substring(name.length - 3) !== "__c") {
			return alert("Esta variable no se puede eliminar")
		}

		this.props.dispatch(crop.removeVariable(this.props.User, name))

	}

	getCrop(e){

		if (!e.target.dataset.crop) return

		this.props.dispatch(crop.readCrop({
			"cid": "-KeKVCaIitfwzQZeBr26",
		},{
			"Id": e.target.dataset.crop
		}))

		this.setState({Crop:e.target.dataset.crop})
	}

	createCrop(e){

		const newCrop = {
			Max: document.querySelector('[name="Max"]').value.trim(),
			Min: document.querySelector('[name="Min"]').value.trim(),
			Formula: document.querySelector('[name="Formula"]').value.trim(),
			isModify: document.querySelector('[name="isModify"]').checked,
			Sensor: document.querySelector('[name="Sensor"]').checked,
			Name: document.querySelector('[name="Name"]').value.trim()
		}

		if (!newCrop.Name) {
			return 
		}

		this.props.dispatch(crop.addVaraibles(this.props.User, newCrop))
	}


}