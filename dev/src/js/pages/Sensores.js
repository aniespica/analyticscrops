import React, { PropTypes, Component } from "react"
import { browserHistory } from 'react-router'
import { connect } from "react-redux"

import * as crop from '../actions/crops'
import Form from '../components/Forms'
import Table from '../components/Table'
import ListViewHeader from '../components/ListViewHeader'

@connect((store)=>{
	return {
		Crop: store.crop.Crop,
		Users: store.user.Users,
		User: store.user.User,
		Sensors: store.crop.Sensors
	}
})
export default class Sensores extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {
		super()
		this.state = {
			Title: 'Sensores',
			Titles:['Nombre',
				'Serial',
				'Lotes',
				'Variable'
			],
			RowsTitles:[
				'Id',
				'Lotes',
				'Variable',
			],
			Sections: [{
				Title:"Informacion",
				Columns:[[{
					Label:'Nombre',
					Name:'Name',
					Value: '',
					Type: 'text'
				},
				{
					Label:'Serial',
					Name:'Serial',
					Value: '',
					Type: 'text'
				}],
				[{
					Label:'Cultivo',
					Name:'CropId',
					Value: '',
					Type: 'text'
				},
				{
					Label:'Variable',
					Name:'VariableId',
					Value: '',
					Type: 'text'
				}]]
			}]
		}
	}

	componentDidMount(){
		this.props.dispatch(crop.readSensors(this.props.User))
	}

	componentDidUpdate() {}

	componentWillUnmount(){}

	componentWillMount(){}

	render() {

		const self = this
		
		return (
			<div id="CropContent">
				<div class="headerTitle">
					<ListViewHeader Title={this.state.Title} isSensor={true} buttons={[{title:'Nuevo'}]}/>
				</div>
				
				<Table trash={this.trash.bind(this)} link={false} RowsTitles={this.state.RowsTitles} Rows={this.props.Sensors} Small={3} Medium={5} Large={5} Titles={this.state.Titles} onClick={this.getCrop.bind(this)}/>
				<Form Title='Añadir Usuario' id='1' onSubmit={this.addSensor.bind(this)} sections={this.state.Sections} />
				
			</div>
		)

	}

	trash(e){
		var name = e.target.dataset.name
		this.props.dispatch(crop.removeSensor(this.props.User, name))
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

	addSensor(e){

		e.preventDefault()
		this.props.dispatch(crop.createCrop({
		  "cid": "-KeKVCaIitfwzQZeBr26",
		  "profile": "Admin"	
		 },{
			"Area": this.state.Area,
			"StartDate": this.state.StartDate,
			"CropVariety": this.state.CropVariety,
			"IrrigationType": this.state.IrrigationType,
			"FieldCapacity": this.state.FieldCapacity,
			"Lara": this.state.Lara,
			"isCalculate": this.state.isCalculate,
			"Name": this.state.Name
			}))

		this.setState({Crop: true, display: {
				form: false
			}})
		document.querySelector('#backgroundForm').style.display = 'none'
	}


}