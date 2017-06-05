import React, { PropTypes, Component } from "react"
import { browserHistory } from 'react-router'
import { connect } from "react-redux"
import moment from 'moment'

import * as crop from '../actions/crops'
import Form from '../components/Forms'
import Table from '../components/Table'
import ListViewHeader from '../components/ListViewHeader'

@connect((store)=>{
	return {
		Crop: store.crop.Crop,
		Crops: store.crop.Crops,
		User: store.user.User,
		Fetching: store.crop.Fetching,
	}
})
export default class Crops extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {
		super()
		this.state = {
			ListTitle: 'Recientes',
			Title: 'Cultivos',
			Titles:['Nombre',
				'Fecha De Inicio',
				'Variedad De Cultivo',
				'Tipo De Riego',
				'Ultima Modificacion'
			],
			RowsTitles:[
				'StartDate',
				'CropVariety',
				'IrrigationType',
				'ModifyDate'
			],
			Sections: [{
				Title:"Informacion",
				Columns:[[{
					Label:'Nombre',
					Name:'Name',
					Value: '',
					Type: 'text',
					Required:true
				},
				{
					Label:'Fecha de Inicio',
					Name:'StartDate',
					Value: moment(),
					Type: 'date',
					Required:true
				}],
				[{
					Label:'Tipo de Riego',
					Name:'IrrigationType',
					Value: '',
					Type: 'text'
				},
				{
					Label:'Variedad de Cultivo',
					Name:'CropVariety',
					Value: '',
					Type: 'text'
				}],
				[{
					Label:'LARA',
					Name:'Lara',
					Value: 0,
					Type: 'number',
					Disabled: true
				},
				{
					Label:'Capacidad de Campo',
					Name:'FieldCapacity',
					Value: 0,
					Type: 'number',
					Disabled: true
				}],
				[{
					Label:'Area',
					Name:'Area',
					Value: 0,
					Type: 'number',
					Disabled: true
				},
				{
					Label:'Calcular',
					Name:'isCalculate',
					Value: false,
					Type: 'checkbox'
				}]]
			}]
		}
	}

	componentDidMount(){
		if (this.context.router.location.pathname == '/cultivos') {
			this.props.dispatch(crop.readCrops(this.props.User, 'Recently'))
		}

		var _crop = crop
	}

	componentDidUpdate() {
		if (this.props.Fetching) {
			document.querySelector('#formContainer1 .closeForme').click()
			document.getElementById('spinner').style.display = "none"
			this.context.router.push(this.context.router.location.pathname + '/' + this.props.Fetching)
		}
		// this.initMap()
	}

	componentWillUnmount(){
		// this.initMap()
	}

	componentWillMount(){
	}

	render() {

		const self = this

		// console.log(this.props.User)
		
		return (
			<div id="CropContent">
				<div class="headerTitle">
					<ListViewHeader Title={this.state.Title} buttons={[{title:'Nuevo'}]}/>
					<ul class="dropdown menu" data-dropdown-menu>
					  <li class="is-dropdown-submenu-parent opens-right">
					    <a onClick={this.tiggerList.bind(this)}>{this.state.ListTitle}</a>
					    <ul class="menu submenu is-dropdown-submenu first-sub vertical">
					      <li><a onClick={this.getCrops.bind(this)} data-option='Recently'>Recientes</a></li>
					      <li><a onClick={this.getCrops.bind(this)} data-option='All'>Todos</a></li>
					    </ul>
					  </li>
					</ul>
				</div>
				
				<Table trash={this.trash.bind(this)} RowsTitles={this.state.RowsTitles} Rows={this.props.Crops} Small={3} Medium={6} Large={7} Titles={this.state.Titles} onClick={this.getCrop.bind(this)}/>
				<Form Title='Crear Cultivo' id='1' onSubmit={this.addCrop.bind(this)} sections={this.state.Sections} />
				
			</div>
		)

	}

	trash(e){
		var name = e.target.dataset.name

		var r = confirm("Usted esta a punto de eliminar un cultivo esta seguro de esta acción!");
		if (r == true) {

			var body = {
				cropid: name
			}

		  this.props.dispatch(crop.removeCrop(this.props.User, name))
		}

	}

	tiggerList(){
		var el = document.querySelector('.is-dropdown-submenu')

		if (!el.style.display || el.style.display == 'none') {
			el.style.display = 'block'
		}else{
			el.style.display = 'none'
		}
	}

	getCrops(e){

		document.querySelector('.is-dropdown-submenu').style.display = 'none'
		
		this.props.dispatch(crop.readCrops(this.props.User, e.target.dataset.option))

		this.setState({ListTitle: e.target.innerHTML})

	}

	getCrop(e){

		if (!e.target.dataset.crop) return

		this.props.dispatch(crop.readCrop({
			"cid": this.props.User,
		},{
			"Id": e.target.dataset.crop
		}))

		this.setState({Crop:e.target.dataset.crop})
	}

	addCrop(e){
		e.preventDefault()

		const newCrop = {
			Area: document.querySelector('[name="Area"]').value.trim(),
			StartDate: document.querySelector('[name="StartDate"]').value.trim(),
			CropVariety: document.querySelector('[name="CropVariety"]').value.trim(),
			IrrigationType: document.querySelector('[name="IrrigationType"]').value.trim(),
			FieldCapacity: document.querySelector('[name="FieldCapacity"]').value.trim(),
			Lara: document.querySelector('[name="Lara"]').value.trim(),
			isCalculate: document.querySelector('[name="isCalculate"]').checked,
			Name: document.querySelector('[name="Name"]').value.trim()
		}

		if (!newCrop.StartDate || !newCrop.Name) {
			return 
		}

		document.getElementById('spinner').style.display = "block"
		this.props.dispatch(crop.createCrop(this.props.User, newCrop))

	}


}