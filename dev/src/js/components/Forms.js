import React, { PropTypes, Component } from 'react';
import { browserHistory } from 'react-router';

import DatePicker from 'react-datepicker'
import moment from 'moment'

/*Components*/

export default class Forms extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {
		super()
		this.state = {}
	}
	componentDidMount() {}
	componentWillReceiveProps(nextProps) {}
	componentDidUpdate(prevProps, prevState) {}
	componentWillUpdate(nextProps, nextState) {}
	componentWillMount(){}

	render() {

		return (
			<div id={"formContainer"+this.props.id}>
				<div onClick={this.hidefrom.bind(this)} role='icon' data-icon="close" class='closeForme'></div>
				<div>
					<div class='titleForm'>{this.props.Title}</div>
					<form onSubmit={this.props.onSubmit.bind(this)}>
						<div class='formContent'>
							{this.renderSection(this.props.sections)}
						</div>
						<div class='formSectionButtons button-group'>
							  <a onClick={this.hidefrom.bind(this)} class="button">Cancelar</a>
							  <button type='submit' class="button">Guardar</button>
						</div>
					</form>
				</div>
			</div>
		)

	}

	renderSection(sections){

		if (Array.isArray(sections)) {
			const self = this
			var section = sections.map(function(el, index){
				return (
					<div key={index} >
						<div class='subTitleForm'>{el.Title}</div>
						{self.renderColumns(el.Columns)}
					</div>
				)
			})

			return section
		}

		return null

	}

	renderColumns(columns){

		if (Array.isArray(columns)) {
			const self = this
			var column = columns.map(function(inputs, index){
				return (
					<div key={index} class='row'>{self.renderInputs(inputs)}</div>
				)
			})

			return column
		}

		if (columns.ClassName = 'map') {
			return (
				<div>
					<div id="map"></div>
				</div>
			)
		}
		return null

	}

	renderInputs(inputs){

		if (Array.isArray(inputs)) {
			const self = this
			var input = inputs.map(function(el, index){
				
				if (!self.state[el.Name]) self.state[el.Name] = el.Value
			 
				if (Array.isArray(el.Value)) {
					if (!self.state[el.Name]) self.state[el.Name] = [el.Value[0].Id]
					return (
							<div key={index} class='small-6 column'>
								<label>{el.Label}</label>
								<select name={el.Name}>
					            {el.Value.map(function(e, i){
					            	return <option key={i} value={e.Id}>{e.Name}</option>
					            })}
					          </select>
							</div>
						)
				}

				if (el.Type == 'date') {
					return (
						<div key={index} class='small-6 column'>
							<label>{el.Label}</label>
							<DatePicker name={el.Name}
							  selected={self.state[el.Name]}
					        onChange={self.onChange.bind(self)} 
					        dateFormat="YYYY-MM-DD"
					        showYearDropdown 
					        scrollableYearDropdown
					        showMonthDropdown/>
					   </div>
					)

				}
				return (
					<div key={index} class='small-6 column'>
						<label>{el.Label}</label>
						{ el.Type === 'checkbox'
							? <input required={el.Required} disabled={self.state.isCalculate && el.Disabled ? true : false} type={el.Type} name={el.Name} checked={self.state[el.Name]} onChange={self.onChange.bind(self)}/>
							: <input required={el.Required} disabled={self.state.isCalculate && el.Disabled ? true : false} type={el.Type} name={el.Name} value={self.state[el.Name]} onChange={self.onChange.bind(self)}/>
						}
					</div>
				)
			})

			return input
		}

		return null

	}

	onChange(e, i){
		var obj = {}
		if (e.target) {
			obj[e.target.name] = e.target.type == 'checkbox' ? e.target.checked : e.target.value 
		}else{
			if (document.getElementById('formContainer2') && document.getElementById('formContainer2').style.display === 'block') {
				obj.cStartDate = e
			} else {
				obj.StartDate = e
			}
		}

		this.setState(obj)
	}

	hidefrom(){

		var keys = Object.keys(this.state)
		const self = this
		keys.map(function(e){
			var obj = {}
			obj[e] = ''
			self.setState(obj)
		})
		document.getElementById('formContainer'+this.props.id).style.display = 'none'
		document.getElementById('backgroundForm').style.display = 'none'
	}

}