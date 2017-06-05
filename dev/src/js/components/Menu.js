import React, { PropTypes, Component } from 'react';
import { browserHistory } from 'react-router';

/*Components*/
import TopicMenu from './TopicMenu'

export default class Menu extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {
		super()
		this.state = {
			items:[{
				label: 'Gestionar usuarios',
				icon: 'user',
				options: [{
					label: 'Usuarios',
					path:'/usuarios'					
				},
				{
					label: 'Perfil',
					path:'/perfil'					
				},
				{
					label: 'Perfiles',
					path:'/perfiles'					
				}]
			},
			{
				label: 'Cultivos',
				icon: 'crop',
				path:'/cultivos'
			},
			{
				label: 'Variables',
				icon: 'variable',
				path:'/variables'
			},
			,
			{
				label: 'Sensores',
				icon: 'sensores',
				path:'/sensores'
			}],
			icon:'th-small'
		}
	}

	componentWillMount() {

		if(window.innerWidth >= 640){
			this.setState({icon: 'th-large'})
		}

	}

	render() {

		return (
			<div id='NavBar'>
				<div id="NavIcon" role='navElement' onClick={this.diggleMenu.bind(this)}>
					<div role='icon' title='search' data-icon={this.state.icon}></div>
				</div>
				<div id='NavSearch' role='navElement' onClick={this.diggleMenuForElement.bind(this)}>
					<div role='icon' title='search'></div>
					<div id="BarSearch" role='barElement'>
						<div class='contentSearch contentElement'>
							<input type='search' placeholder="Busca cultivo"/>
						</div>
					</div>
				</div>
				{ this.state.items.map(function(e, i){
					return <TopicMenu key={i} path={e.path} icon={e.icon} label={e.label} options={e.options}/>
				})}
			</div>
		)

	}

	diggleMenu(e){

		if (e.target.children[0].dataset.icon === 'th-large') {
			e.target.children[0].dataset.icon = 'th-small'
			document.getElementById('NavBar').style.width = '60px'
			document.querySelectorAll('[role="navElement"]').forEach(function(e){
				return e.style.height = "60px"
			})
			return
		}

		e.target.children[0].dataset.icon = 'th-large'
		document.getElementById('NavBar').style.width = '100%'

	}

	diggleMenuForElement(){
		if (document.getElementById('NavIcon').children[0].dataset.icon === 'th-small') {
			document.getElementById('NavIcon').children[0].dataset.icon = 'th-large'
			document.getElementById('NavBar').style.width = '100%'
		}
	}


}