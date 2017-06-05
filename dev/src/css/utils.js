"use strict";

import Firebase from "firebase"
import cookie from 'react-cookie';

window.UserContext = null;

class Utils {
	constructor() {
		this.apiKey = "AIzaSyCVWW3FnP_A5dDLdg6MsCoHLUEEvxtt0_U";

		const fb = new Firebase.initializeApp({
			apiKey: this.apiKey,
			authDomain: "projectgrade-6b702.firebaseapp.com",
			databaseURL: "https://projectgrade-6b702.firebaseio.com",
			storageBucket: "projectgrade-6b702.appspot.com"
		})

		this.auth = fb.auth();
		this.db = fb.database();
		this.storage = fb.storage();
		this.cookie = cookie;
		this.variables = new Variables()
		this.profileNames = new ProfileNames()

		if (localStorage.length == 0 && cookie.load("localStorage")) {
			var key = cookie.load("localStorage")["firebase:authUser:"+this.apiKey+":[DEFAULT]"]
			UserContext = key
			storeWindow("firebase:authUser:"+this.apiKey+":[DEFAULT]",key)
		}
		if (!UserContext && cookie.load("localStorage")) {
			var user = JSON.parse(cookie.load("localStorage")["firebase:authUser:"+this.apiKey+":[DEFAULT]"])
			user.Name = user.displayName
			UserContext = user
		}

	}
	onChange(e){
		var o = {};
      o[e.target.name] = e.target.value;
      this.setState(o);
	}
	isValidEmail(e){
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(e);
	}
	showSpinner(){
		document.getElementById('Spinner').style.display = 'block'
	}
	hideSpinner(){
		document.getElementById('Spinner').style.display = 'none'
	}
}

class Variables {
	constructor(){}
	get default(){
		return {
			Evaporation: {
				status: 'active',
				Name: 'Evaporación',
				Max: 100,
				Min: 0,
				Alert: true
			},
			CropFactor: {
				status: 'active',
				Name: 'Factor de cultivo',
				Max: 100,
				Min: 0,
				Alert: true
			},

			Evapotranspiration: {
				status: 'active',
				Name: 'Evapotranspiracion',
				Max: 100,
				Min: 0,
				Alert: true
			},

			EffectivePrecipitation: {
				status: 'active',
				Name: 'Precipitacion efectiva',
				Max: 100,
				Min: 0,
				Alert: true
			},

			EffectiveIrrigation: {
				status: 'active',
				Name: 'Riego efectivo',
				Max: 100,
				Min: 0,
				Alert: true
			},

			SoilMoisture: {
				status: 'active',
				Name: 'Humedad del suelo',
				Max: 100,
				Min: 0,
				Alert: true
			}
		}
	}
}

class ProfileNames {
	constructor(){}
	get default(){
		return {
			Admin: {
				Status: 'active',
				Name: 'Administrador'
			},
			Visit: {
				Status: 'active',
				Name: 'Visitante'
			},
			Register: {
				Status: 'active',
				Name: 'Registrador'
			}
		}
	}
}

window.utils = new Utils();


