"use strict";

import Firebase from "firebase"
import cookie from 'react-cookie';
import moment from 'moment';

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
		this.cUser = fb.auth().currentUser
		this.cookie = cookie;
		this.variables = new Variables()
		this.profileNames = new ProfileNames()
		this.moment = moment

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
		document.getElementById('spinner').style.display = 'block'
	}
	hideSpinner(){
		document.getElementById('spinner').style.display = 'none'
	}
}

class Variables {
	constructor(){}
	get default(){
		return {
			"CropFactor" : {
          "Alert" : true,
          "Formula" : "Prev(CropFactor)",
          "Max" : 100,
          "Min" : 0,
          "Name" : "Factor de cultivo",
          "isModify" : true,
          "status" : "active"
        },
        "EffectiveIrrigation" : {
          "Alert" : true,
          "Max" : 100,
          "Min" : 0,
          "Name" : "Riego efectivo",
          "status" : "active"
        },
        "EffectivePrecipitation" : {
          "Alert" : true,
          "Max" : 100,
          "Min" : 0,
          "Name" : "Precipitacion efectiva",
          "status" : "active"
        },
        "EffectivePrecipitationReal" : {
          "Max" : 0,
          "Min" : 1000,
          "Name" : "Precipitación Efectiva Sensada",
          "Sensor" : true
        },
        "Evaporation" : {
          "Alert" : true,
          "Max" : 100,
          "Min" : 0,
          "Name" : "Evaporación",
          "status" : "active"
        },
        "Evapotranspiration" : {
          "Alert" : true,
          "Formula" : "Evaporation * CropFactor",
          "Max" : 100,
          "Min" : 0,
          "Name" : "Evapotranspiracion",
          "status" : "active"
        },
        "SoilMoisture" : {
          "Alert" : true,
          "Formula" : "Prev(SoilMoisture) - Prev(Evapotranspiration) + EffectivePrecipitation + EffectiveIrrigation",
          "Init" : true,
          "Max" : 100,
          "Min" : 0,
          "Name" : "Humedad del suelo",
          "status" : "active"
        },
        "SoilMoistureReal" : {
          "Max" : 0,
          "Min" : 1000,
          "Name" : "Humedad del Suelo Sensada",
          "Sensor" : true
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


