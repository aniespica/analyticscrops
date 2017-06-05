import React, { PropTypes, Component } from 'react';
import { browserHistory, Link } from 'react-router';

/*Components*/

export default class Table extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {
		super()
		this.state = {}
	}

	render() {

		return (
			<div class='tableRow'>
				<div class={"header row small-up-"+this.props.Small+" medium-up-"+this.props.Medium+" large-up-"+this.props.Large}>
					<div class="actions columns"></div>
					{this.renderHeaderTitle(this.props.Titles)}
				</div>
				{this.renderRows(this.props.Rows)}
			</div>
		)

	}

	renderHeaderTitle(titles, object){

		if (Array.isArray(titles)) {
			var title = titles.map(function(el, index){

				if (object && object[el] && typeof object[el] === 'string') {
					return (
						<div key={index} class="large-expand columns">{object[el]}</div>
					)
				}

				if (object !== null && object !== undefined ) {
					return (
						<div key={index} class="large-expand columns">{object[el]}</div>
					)
				}

				return (
					<div key={index} class="large-expand columns">{el}</div>
				)
			})

			return title
		}

		return null
	}

	renderRows(rows){

		//<span role="icon" data-icon="write" title="Editar"></span>

		if (Array.isArray(rows)) {
			let self = this;
			const {pathname} = self.context.router.location
			var row = rows.map(function(el, index){
				return (
					<div key={index} class={"row small-up-"+self.props.Small+" medium-up-"+self.props.Medium+" large-up-"+self.props.Large}>
						<div class="actions columns">
							{ self.props.icons !== false
								? <span onClick={self.props.trash.bind(self)} data-name={el.Id} role="icon" data-icon="trash" title="Eliminar"></span>
								: null
							}
						</div>
						
						{ self.props.link !== false

							? (
								<div class="large-expand columns link">
									<Link to={pathname+'/'+el.Id} >{el.Name}</Link>
								</div>
							)
							: (
								<div class="large-expand columns">
									<div>{el.Name}</div>
								</div>
							)
						}
						{self.renderHeaderTitle(self.props.RowsTitles, el)}
					</div>
				)
			})

			return row
		}

		return null

	}


}