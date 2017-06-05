import React, { PropTypes, Component } from 'react';
import { browserHistory, Link } from 'react-router';
import { connect } from "react-redux"
/*Components*/
@connect((store)=>{
	return {
		User: store.user.User,
	}
})
export default class Headbar extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor() {
		super()
		this.state = {}
	}

	render() {

		const {isModify, isSensor, formula, User} = this.props

		var isDisabled = false;
		var lastLink = ""
		if(this.props.sutitle){
			lastLink = this.context.router.location.pathname.split('/');
			lastLink.pop(lastLink.length - 1)
		}
		
		if (formula && !isModify) isDisabled = true
		if (User.Profile === 'Visit') isDisabled = true
		if (isSensor) isDisabled = true

		// debugger

		return (
			<div class="row">
			  	<div class="small-8 column">
			  		{this.props.sutitle && <h7><Link to={lastLink.join().replace(/,/g, '/')}>{this.props.sutitle}</Link></h7>}
			   	<h1>{this.props.Title}</h1>
			  	</div>
			  	<div class="small-4 column">
			  		<button data-nb="1" onClick={this.showfrom.bind(this)} class="hollow button" disabled={User.Profile === 'Visit' ? true : isDisabled}>{this.props.buttons[0].title}</button>
			  		{this.props.buttons[1] &&  <button data-nb="2" onClick={this.showfrom.bind(this)} class="hollow button" disabled={User.Profile === 'Visit' ? true : false}>{this.props.buttons[1].title}</button> }
			  	</div>
			</div>
		)

	}

	showfrom(e){
		
		document.getElementById('formContainer'+e.target.dataset.nb).style.display = 'block'
		document.getElementById('backgroundForm').style.display = 'block'

		if (document.getElementById('map')) {
			this.initMap()
		}
	}

	initMap(){

		var map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: -34.397, lng: 150.644},
			zoom: 6
		});
		var infoWindow = new google.maps.InfoWindow({map: map});

		// Try HTML5 geolocation.
		if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			infoWindow.setPosition(pos);
			infoWindow.setContent('Location found.');
			map.setCenter(pos);
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
		} else {
			// Browser doesn't support Geolocation
			handleLocationError(false, infoWindow, map.getCenter());
		}
		

		function handleLocationError(browserHasGeolocation, infoWindow, pos) {
		  infoWindow.setPosition(pos);
		  infoWindow.setContent(browserHasGeolocation ?
		                        'Error: The Geolocation service failed.' :
		                        'Error: Your browser doesn\'t support geolocation.');
		}
	}


}