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
		Vars: store.crop.Vars
	}
})
export default class Crops extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {
		super()
		this.state = {
			Titles:['Fecha',
				'Valor Minimo',
				'Valor Maximo',
				'Fecha ultimo valor'
			],
			RowsTitles:[
				'Min',
				'Max',
				'Date'
			],
			Crop: null,
			sections: [{
				Title:"Informacion",
				Columns:[[{
					Label:'Date',
					Name:'StartDate',
					Value: moment(),
					Type: 'date',
					Required:true
				},
				{
					Label:'Valor',
					Name:'Value',
					Value: 0,
					Type: 'number',
					Required:true
				}]]
			}]
		}
	}

	componentDidMount(){
		this.props.dispatch(crop.readVars(this.props.User, this.props.params.crop, this.props.params.lote, this.props.params.vars))
	}

	componentDidUpdate() {
		this.rVals(this.state.values)
		if (this.props.Fetching === true) {
			document.querySelector('#formContainer1 .closeForme').click()
			document.getElementById('spinner').style.display = "none"
		}
	}

	componentWillUnmount(){}
	componentWillMount(){}

	render() {

		const {Lote, Vars} = this.props;

		let vars = Vars.Values ? Object.keys(Vars.Values) : []
		var variables = []
		var value = []
		this.state.values = []
		
		for(var i in vars){
			var v = Vars.Values[vars[i]]
			if (!v) continue
			v.Id = vars[i]
			v.Name = vars[i]
			value.push(new Date(vars[i]))
			value.push(v.Average)
			this.state.values.push(value)
			value = []
			let vals = v.Values ? Object.keys(v.Values) : [];
			for(var j in vals){
				var vl = v.Values[vals[j]];
				if (vl === undefined || vl === null) continue
				if (v.Min === undefined || v.Min < vl) v.Min = vl
				if (v.Max === undefined || v.Max > vl) v.Max = vl
				if (j == vals.length - 1){
					v.Date = vals[j];
				} 
			}

			if (v.Min === undefined) v.Min = 0
			if (v.Max === undefined) v.Max = 0
			if (!v.Date) v.Date = ''
			
			variables.push(v);
		}

		return (
			<div id="CropContent">
				<div class="headerTitle">
					<ListViewHeader sutitle="variable" isSensor={Vars.Sensor} isModify={Vars.isModify} formula={Vars.Formula} Title={Vars.Name} buttons={[{title:'Añadir Valor'}]}/>
				</div>

				<div id="PageContainer">
					<div>
						<div class='titleForm'>Grafica</div>
						<div>
							<div class="row">
								<div id="chart"></div>
							</div>
						</div>
						<div class='titleForm'>Valores</div>
						<Table trash={this.trash.bind(this)} link={false} RowsTitles={this.state.RowsTitles} Rows={variables} Small={3} Medium={5} Large={5} Titles={this.state.Titles} onClick={this.getLote.bind(this)}/>
					</div>
				</div>
				
				<Form Title={'Añadir Valor'} id="1" onSubmit={this.editLote.bind(this)} sections={this.state.sections} />
				
			</div>
		)

	}

	trash(e){
		var name = e.target.dataset.name

		var body = {
			"cropid": this.props.params.crop,
			"loteid": this.props.params.lote, 
			"varid": this.props.params.vars,
			"date": name
		}

		this.props.dispatch(crop.removeValue(this.props.User, body))

	}

	getLote(){}

	rVals(values){

		var dataTitle = [['Fecha', 'Nivel']]
      dataTitle = dataTitle.concat(values);
      
		google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);
      
      function drawChart() {
        var data = google.visualization.arrayToDataTable(dataTitle);

        var options = {
          title: 'Company Performance',
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart'));

        chart.draw(data, options);
      }

	}

	editLote(e){
		e.preventDefault()
		let self = this;
		const newLote = {
			StartDate: document.querySelector('[name="StartDate"]').value.trim(),
			Value: document.querySelector('[name="Value"]').value.trim(),
			varid: self.props.params.vars,
			cropid: self.props.params.crop,
			loteid: self.props.params.lote
		}

		if (!newLote.StartDate) {
			return 
		}

		document.getElementById('spinner').style.display = "block"
		this.props.dispatch(crop.addValue(this.props.User, newLote))

	}



}