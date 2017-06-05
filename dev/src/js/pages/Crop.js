import React, { PropTypes, Component } from "react"
import { browserHistory } from 'react-router'
import { connect } from "react-redux"
import moment from 'moment'

import * as crop from '../actions/crops'
import ListViewHeader from '../components/ListViewHeader'
import Form from '../components/Forms'
import Table from '../components/Table'

@connect((store)=>{
	return {
		Crop: store.crop.Crop,
		User: store.user.User,
		Fetching: store.crop.Fetching
	}
})
export default class Crops extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {
		super()
		this.state = {
			Titles:['Nombre',
				'Fecha De Inicio',
				'Capacidad de Campo',
				'LARA',
				'Tipo de Campo'
			],
			RowsTitles:[
				'StartDate',
				'FieldCapacity',
				'Lara',
				'FieldType'
			],
			Crop: null,
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
					Label:'Tipo de Campo',
					Name:'FieldType',
					Value: '',
					Type: 'text'
				},
				{
					Label:'Area',
					Name:'Area',
					Value: 0,
					Type: 'number',
					Disabled: true
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
				}]]
			},
			{
				Title:"Valores Iniciales",
				Columns:[[{
					Label:'Humedad del Suelo',
					Name:'initVal',
					Value: '',
					Type: 'number'
				}]]
			}]
		}
	}

	componentDidMount(){
		this.props.dispatch(crop.readCrop(this.props.User, this.props.params.crop))
	}

	componentDidUpdate() {
		if (this.props.Fetching) {
			// this.props.dispatch(crop.readCrop(this.props.User, this.props.params.crop))
			document.getElementById('spinner').style.display = "none"
			if (!this.context.router.location.pathname.includes(this.props.Fetching)) {
				document.querySelector('#formContainer2 .closeForme').click()
				this.context.router.push(this.context.router.location.pathname + '/' + this.props.Fetching)
			}
			
		}

		//this.props.dispatch(crop.readCrop(this.props.User, this.props.params.crop))
		//Something
		// console.log('here did')
	}

	componentWillUnmount(){
		// console.log(this.props.Crops)
	}

	componentWillMount(){

		// var pathname = this.context.router.location.pathname
		// var key = pathname ? pathname.split('/')[2] : null
		// if (key && key != this.props.Crop.Id) {
		// 	this.props.dispatch(crop.readCrop({
		// 		"cid": "-KeKVCaIitfwzQZeBr26",
		// 	},{
		// 		"Id": key
		// 	}))
		// }
		
	}

	render() {

		const {Crop} = this.props;

		// console.log('Crop: ', Crop);

		if (typeof Crop !== 'object' || !Crop) return <div></div>

		
		var Sections = [{
				Title:"Informacion",
				Columns:[[{
					Label:'Nombre',
					Name:'cName',
					Value: Crop.Name,
					Type: 'text',
					Required:true
				},
				{
					Label:'Fecha de Inicio',
					Name:'cStartDate',
					Value: moment(Crop.StartDate),
					Type: 'date',
					Required:true
				}],
				[{
					Label:'Tipo de Riego',
					Name:'cIrrigationType',
					Value: Crop.IrrigationType,
					Type: 'text'
				},
				{
					Label:'Variedad de Cultivo',
					Name:'cCropVariety',
					Value: Crop.CropVariety,
					Type: 'text'
				}],
				[{
					Label:'LARA',
					Name:'cLara',
					Value: parseInt(Crop.Lara),
					Type: 'number',
					Disabled: true
				},
				{
					Label:'Capacidad de Campo',
					Name:'cFieldCapacity',
					Value: parseInt(Crop.FieldCapacity),
					Type: 'number',
					Disabled: true
				}],
				[{
					Label:'Area',
					Name:'cArea',
					Value: parseInt(Crop.Area),
					Type: 'number',
					Disabled: true
				},
				{
					Label:'Calcular',
					Name:'cisCalculate',
					Value: Crop.isCalculate,
					Type: 'checkbox'
				}]]
			}]


		let lotes = Crop.Lotes ? Object.keys(Crop.Lotes) : []
		var Lotes = []

		for(var i in lotes){
			var l = Crop.Lotes[lotes[i]]
			if (!l) continue
			l.Id = lotes[i]
			Lotes.push(l);
		}

		return (
			<div id="CropContent">
				<div class="headerTitle">
					<ListViewHeader sutitle="cultivo" Title={Crop.Name} buttons={[{title:'Añsdir Lote'},{title:'Editar'}]}/>
				</div>

				<div id="PageContainer">
					<div>
						<div class='titleForm'>Información</div>
						<div>
							<div class="row">
								<div class="medium-6 columns">
									<label>Area del Cultivo
										<input type="text" value={Crop.Area} disabled="true"/>
									</label>
								</div>
								<div class="medium-6 columns">
									<label>Fecha de Inicio
										<input type="text" value={Crop.StartDate} disabled="true"/>
									</label>
								</div>
								<div class="medium-6 columns">
									<label>Variedad de Cultivo
										<input type="text" value={Crop.CropVariety} disabled="true"/>
									</label>
								</div>
								<div class="medium-6 columns">
									<label>Tipo de Riego
										<input type="text" value={Crop.IrrigationType} disabled="true"/>
									</label>
								</div>
								<div class="medium-6 columns">
									<label>Capacidad de Campo
										<input type="text" value={Crop.FieldCapacity} disabled="true"/>
									</label>
								</div>
								<div class="medium-6 columns">
									<label>LARA
										<input type="text" value={Crop.Lara} disabled="true"/>
									</label>
								</div>
								<div class="medium-6 columns">
									<label>Se calculan los valores
										<input type="checkbox" checked={Crop.isCalculate} disabled="true"/>
									</label>
								</div>
							</div>
						</div>
						<div class='titleForm'>Lotes</div>
						<Table trash={this.trash.bind(this)} RowsTitles={this.state.RowsTitles} Rows={Lotes} Small={3} Medium={6} Large={6} Titles={this.state.Titles} onClick={this.getLote.bind(this)}/>
					</div>
				</div>
				
				<Form Title={'Editar ' + Crop.Name} id="2" onSubmit={this.editCrop.bind(this)} sections={Sections} />
				<Form Title='Añadir Lote' id="1" onSubmit={this.addLote.bind(this)} sections={this.state.Sections} />
				
			</div>
		)

	}

	trash(e){
		var name = e.target.dataset.name

		var r = confirm("Usted esta a punto de eliminar un lote esta seguro de esta acción!");
		if (r == true) {

			var body = {
				cropid: this.props.params.crop,
				loteid: name
			}

		  this.props.dispatch(crop.removeLote(this.props.User, body))
		} 

	}

	getLote(){}

	editCrop(e){
		e.preventDefault()

		const newCrop = {
			Area: document.querySelector('[name="cArea"]').value.trim(),
			StartDate: document.querySelector('[name="cStartDate"]').value.trim(),
			CropVariety: document.querySelector('[name="cCropVariety"]').value.trim(),
			IrrigationType: document.querySelector('[name="cIrrigationType"]').value.trim(),
			FieldCapacity: document.querySelector('[name="cFieldCapacity"]').value.trim(),
			Lara: document.querySelector('[name="cLara"]').value.trim(),
			isCalculate: document.querySelector('[name="cisCalculate"]').checked,
			Name: document.querySelector('[name="cName"]').value.trim(),
			cropid: this.props.params.crop
		}

		if (!newCrop.StartDate || !newCrop.Name) {
			return 
		}

		document.getElementById('spinner').style.display = "block"

		this.props.dispatch(crop.createCrop(this.props.User, newCrop))

	}

	addLote(e){
		e.preventDefault()
		let self = this;
		const newLote = {
			Area: document.querySelector('[name="Area"]').value.trim(),
			StartDate: document.querySelector('[name="StartDate"]').value.trim(),
			FieldType: document.querySelector('[name="FieldType"]').value.trim(),
			FieldCapacity: document.querySelector('[name="FieldCapacity"]').value.trim(),
			Lara: document.querySelector('[name="Lara"]').value.trim(),
			Name: document.querySelector('[name="Name"]').value.trim(),
			initVal: document.querySelector('[name="initVal"]').value.trim(),
			cropid: self.props.params.crop
		}

		if (!newLote.StartDate || !newLote.Name) {
			return 
		}

		document.getElementById('spinner').style.display = "block"

		this.props.dispatch(crop.upsertLote(this.props.User, newLote, this))

	}



}