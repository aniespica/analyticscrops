import React, { PropTypes, Component } from "react"
import { browserHistory } from 'react-router'


export default class ListView extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {
		super()
		this.state = {}
	}

	componentDidMount(){}

	componentDidUpdate() {}

	componentWillUnmount(){}

	render() {

		return (
			<div id="ListWrapper">
				<div class='title'>Lista de usuarios</div>
				<div>
					<table>
					  <thead>
					    <tr>
					      <th width="200">Nombre</th>
					      <th>Profile</th>
					      <th width="150">Email</th>
					      <th width="150"></th>
					    </tr>
					  </thead>
					  <tbody>
					    <tr>
					      <td>Ana Maria Cabrera</td>
					      <td>Administrador</td>
					      <td>aniespica@gmail.com</td>
					      <td>Edit Delete</td>
					    </tr>
					    <tr>
					    	<td>Ana Maria Cabrera</td>
					    	<td>ana.cabrera@auctifera.com</td>
					      <td>Editor</td>
					      <td>Edit Delete</td>
					    </tr>
					    <tr>
					      <td>Ana Maria Cabrera</td>
					      <td>Visitante</td>
					      <td>ana.cabrera@veevart.com</td>
					      <td>Edit Delete</td>
					    </tr>
					    <tr>
					    	<td>Ana Maria Cabrera</td>
					      <td>Administrador</td>
					      <td>aniespica@hotmail.com</td>
					      <td>Edit Delete</td>
					    </tr>
					  </tbody>
					</table>
				</div>
			</div>
		)

	}


}