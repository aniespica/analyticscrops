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
		Lote: store.crop.Lote,
		User: store.user.User,
		Fetching: store.crop.Fetching,
		Variables: store.crop.Variables
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
				'Valor Minimo',
				'Valor Maximo',
				'Fecha ultimo valor'
			],
			RowsTitles:[
				'Min',
				'Max',
				'Date'
			],
			Crop: null
		}
	}

	componentDidMount(){
		this.props.dispatch(crop.readLote(this.props.User, this.props.params.crop, this.props.params.lote))
		this.props.dispatch(crop.readVariables(this.props.User))
	}

	componentDidUpdate() {
		if (this.props.Fetching) {
			document.getElementById('spinner').style.display = "none"

			if (!this.context.router.location.pathname.includes(this.props.Fetching)) {
				document.querySelector('#formContainer2 .closeForme').click()
				this.context.router.push(this.context.router.location.pathname + '/' + this.props.Fetching)
			}
		}
	}

	componentWillUnmount(){}

	componentWillMount(){}

	render() {

		const {Lote, Variables} = this.props;

		var Sections = [{
				Title:"Informacion",
				Columns:[[{
					Label:'Nombre',
					Name:'Name',
					Value: Lote.Name,
					Type: 'text',
					Required:true
				},
				{
					Label:'Fecha de Inicio',
					Name:'cStartDate',
					Value: moment(Lote.StartDate),
					Type: 'date',
					Required:true
				}],
				[{
					Label:'Tipo de Campo',
					Name:'FieldType',
					Value: Lote.FieldType,
					Type: 'text'
				},
				{
					Label:'Area',
					Name:'Area',
					Value: parseInt(Lote.Area),
					Type: 'number',
					Disabled: true
				}],
				[{
					Label:'LARA',
					Name:'Lara',
					Value: parseInt(Lote.Lara),
					Type: 'number',
					Disabled: true
				},
				{
					Label:'Capacidad de Campo',
					Name:'FieldCapacity',
					Value: parseInt(Lote.FieldCapacity),
					Type: 'number',
					Disabled: true
				}]]
			}]

		var inputVals = []
		for (var i = 0; i < Variables.length; i++) {
			if (Variables[i].Sensor) {
				inputVals.push(Variables[i])
			}
		}
		var sections = [{
				Title:"Informacion",
				Columns:[[{
					Label:'Nombre',
					Name:'Name',
					Value: '',
					Type: 'text',
					Required:true
				},
				{
					Label:'Serial',
					Name:'Id',
					Value: '',
					Type: 'text',
					Required:true
				}],
				[{
					Label:'Variable',
					Name:'Variable',
					Value: inputVals,
					Type: 'text'
				}]]
			}]


		let vars = Lote.Variables ? Object.keys(Lote.Variables) : []
		var variables = []

		for(var i in vars){
			var v = Lote.Variables[vars[i]]
			if (!v) continue
			v.Id = vars[i]
			var Max, Min, cDate;
			for(var j in v.Values){
				if (!Max || Max < v.Values[j].Average) Max = v.Values[j].Average
				if (!Min || Min > v.Values[j].Average) Min = v.Values[j].Average
				
			}
			v.Max = Max
			v.Min = Min
			v.Date = vars[i]
			variables.push(v);
		}

		return (
			<div id="CropContent">
				<div class="headerTitle">
					<ListViewHeader sutitle="lote" Title={Lote.Name} buttons={[{title:'Añadir Sensor'}, {title:'Editar'}]}/>
				</div>

				<div id="PageContainer">
					<div>
						<div class='titleForm'>Información</div>
						<div>
							<div class="row">
								<div class="medium-6 columns">
									<label>Area del Cultivo
										<input type="text" value={Lote.Area} disabled="true"/>
									</label>
								</div>
								<div class="medium-6 columns">
									<label>Fecha de Inicio
										<input type="text" value={Lote.StartDate} disabled="true"/>
									</label>
								</div>
								<div class="medium-6 columns">
									<label>Tipo de Campo
										<input type="text" value={Lote.FieldType} disabled="true"/>
									</label>
								</div>
								<div class="medium-6 columns">
									<label>Capacidad de Campo
										<input type="text" value={Lote.FieldCapacity} disabled="true"/>
									</label>
								</div>
								<div class="medium-6 columns">
									<label>LARA
										<input type="text" value={Lote.Lara} disabled="true"/>
									</label>
								</div>
							</div>
						</div>
						<div class='titleForm'>Variables</div>
						<Table trash={this.trash.bind(this)} icons={false} RowsTitles={this.state.RowsTitles} Rows={variables} Small={3} Medium={5} Large={5} Titles={this.state.Titles} onClick={this.getLote.bind(this)}/>
						<div class='titleForm'>Sensores</div>
						<Table trash={this.trash.bind(this)} RowsTitles={this.state.RowsTitles} Rows={[]} Small={3} Medium={5} Large={5} Titles={this.state.Titles} onClick={this.getLote.bind(this)}/>
					</div>
				</div>
				
				<Form Title={'Editar ' + Lote.Name} id="2" onSubmit={this.editLote.bind(this)} sections={Sections} />
				<Form Title={'Añadir Sensor'} id="1" onSubmit={this.addSensor.bind(this)} sections={sections} />
				
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

	getLote(){}

	addSensor(e){

		e.preventDefault()
		let self = this;
		const newLote = {
			Name: document.querySelector('[name="Name"]').value.trim(),
		  	Serial: document.querySelector('[name="Id"]').value.trim(),
		   Crop: self.props.params.crop,
			Variable: document.querySelector('[name="Variable"]').value.trim(),
		   Lotes: self.props.params.lote
		}

		if (!newLote.Serial) {
			return 
		}

		document.getElementById('spinner').style.display = "block"
		this.props.dispatch(crop.upsertSensor(this.props.User, newLote, this))

	}

	editLote(e){
		e.preventDefault()
		let self = this;
		const newLote = {
			Area: document.querySelector('[name="Area"]').value.trim(),
			StartDate: document.querySelector('[name="cStartDate"]').value.trim(),
			FieldType: document.querySelector('[name="FieldType"]').value.trim(),
			FieldCapacity: document.querySelector('[name="FieldCapacity"]').value.trim(),
			Lara: document.querySelector('[name="Lara"]').value.trim(),
			Name: document.querySelector('[name="Name"]').value.trim(),
			cropid: self.props.params.crop,
			loteid: self.props.params.lote
		}

		if (!newLote.StartDate || !newLote.Name) {
			return 
		}

		document.getElementById('spinner').style.display = "block"
		this.props.dispatch(crop.upsertLote(this.props.User, newLote, this))

	}



}