import axios from 'axios'
/*Action Crop*/
/*@example
tMuyDqmQDzbUFobjkCyEFUbsJUj2
createCrop({
  "cid": "-KeKVCaIitfwzQZeBr26",
  "profile": "Admin"	
 },{
	"Area": "10Ha",
	"StartDate": "2016-09-30",
	"CropVariety": "CC01-1940",
	"IrrigationType": "Multicompuertas",
	"FieldCapacity": 114,
	"Lara": 57,
	"isCalculate": true,
	"Name": "Test Crop"
	})
*/

export function removeVariable(user, name){
	return dispatch => {
		axios.defaults.headers.common['uid'] = user.Id;
		axios.post('/delete/variable', {
			variableApiName: name
		})
		.then(function (response) {
			dispatch({
				type: "DELETED",
				payload: response
			})
		})
		.catch(function (error) {
			dispatch({
				type: "DELETED",
				payload: error
			})
		});	
	}

}

export function removeSensor(user, serial){
	return dispatch => {
		axios.defaults.headers.common['uid'] = user.Id;
		axios.post('/delete/sensor', {
			serial: serial
		})
		.then(function (response) {
			dispatch({
				type: "DELETED",
				payload: response
			})
		})
		.catch(function (error) {
			dispatch({
				type: "DELETED",
				payload: error
			})
		});	
	}	


}

export function removeValue(user, body){
	return dispatch => {
		axios.defaults.headers.common['uid'] = user.Id;
		axios.post('/delete/value', body)
		.then(function (response) {
			dispatch({
				type: "DELETED",
				payload: response
			})
		})
		.catch(function (error) {
			dispatch({
				type: "DELETED",
				payload: error
			})
		});	
	}	


}

export function removeLote(user, body){
	return dispatch => {
		axios.defaults.headers.common['uid'] = user.Id;
		axios.post('/delete/lote', body)
		.then(function (response) {
			dispatch({
				type: "DELETED",
				payload: response
			})
		})
		.catch(function (error) {
			dispatch({
				type: "DELETED",
				payload: error
			})
		});	
	}	


}

export function removeCrop(user, name){
	return dispatch => {
		axios.defaults.headers.common['uid'] = user.Id;
		axios.post('/delete/crop', {
			cropid: name
		})
		.then(function (response) {
			dispatch({
				type: "DELETED",
				payload: response
			})
		})
		.catch(function (error) {
			dispatch({
				type: "DELETED",
				payload: error
			})
		});	
	}	


}





export function addValue(user, crop){
	return dispatch => {
		axios.defaults.headers.common['uid'] = user.Id;
		axios.post('/upsert/value', {
			StringDate: crop.StartDate + ' 00:00:00' || '2017-12-03 12:30:00',
			cropid: crop.cropid,
			loteid: crop.loteid,
			varid: crop.varid,
			Value: crop.Value || 0
		})
		.then(function (response) {
			dispatch({
				type: "DELETED",
				payload: response
			})
			document.querySelector('#formContainer1 .closeForme').click()
			document.getElementById('spinner').style.display = "none"
		})
		.catch(function (error) {
			dispatch({
				type: "DELETED",
				payload: error
			})
			document.getElementById('spinner').style.display = "none"
		});

	}
}

export function addVaraibles(user, crop){
	return dispatch => {

		axios.defaults.headers.common['uid'] = user.Id;
		axios.post('/upsert/variable', {
			Max: crop.Max || 0,
			Min: crop.Min || 0,
			Formula: crop.Formula,
			isModify: crop.isModify,
			Sensor: crop.Sensor,
			Name: crop.Name
		})
		.then(function (response) {
			dispatch({
				type: "DELETED",
				payload: response
			})
		})
		.catch(function (error) {
			dispatch({
				type: "DELETED",
				payload: error
			})
		});	
	}
}

export function createCrop(user, crop){
	return dispatch => {

		axios.defaults.headers.common['uid'] = user.Id;
		axios.post('/add/crop', {
			Name: crop.Name || '',
			StartDate: crop.StartDate + ' 00:00:00' || '2017-12-03 12:30:00',
			CropVariety: crop.CropVariety || '',
			IrrigationType: crop.IrrigationType || '',
			FieldCapacity: crop.FieldCapacity || 0,
			Lara: crop.Lara || 0,
			isCalculate: crop.isCalculate == true || crop.isCalculate == false ? crop.isCalculate : true,
			Area: crop.Area || 0,
			cropid: crop.cropid || false
		})
		.then(function (response) {
			dispatch({
				type: "CREATE_CROP_FULLFILED",
				payload: response.data ? response.data : true
			})
		})
		.catch(function (error) {
			console.log(error);
			console.log(error.response)
			if (error.response) console.log(error.response.data)
			dispatch({
				type: "CREATE_CROP_REJECTED",
				payload: true
			})
		});

	}
}

export function upsertLote(user, lote){
	return dispatch => {

		axios.defaults.headers.common['uid'] = user.Id;
		axios.post('/upsert/lote', {
			Name: lote.Name || '',
			StartDate: lote.StartDate + ' 00:00:00' || '2017-12-03 12:30:00',
			FieldType: lote.FieldType || '',
			cropid: lote.cropid || '',
			FieldCapacity: lote.FieldCapacity || 0,
			Lara: lote.Lara || 0,
			Area: lote.Area || 0,
			cropid: lote.cropid,
			loteid: lote.loteid,
			initVal: lote.initVal
		})
		.then(function (response) {
			dispatch({
				type: "CREATE_CROP_FULLFILED",
				payload: response.data ? response.data : true
			})
		})
		.catch(function (error) {
			console.log(error);
			console.log(error.response)
			if (error.response) console.log(error.response.data)
			dispatch({
				type: "CREATE_CROP_REJECTED",
				payload: true
			})
		});

	}
}

export function upsertValue(user, lote){
	return dispatch => {

		axios.defaults.headers.common['uid'] = user.Id;
		axios.post('/upsert/lote', {
			Name: lote.Name || '',
			StartDate: lote.StartDate + ' 00:00:00' || '2017-12-03 12:30:00',
			FieldType: lote.FieldType || '',
			cropid: lote.cropid || '',
			FieldCapacity: lote.FieldCapacity || 0,
			Lara: lote.Lara || 0,
			Area: lote.Area || 0,
			cropid: lote.cropid,
			loteid: lote.loteid
		})
		.then(function (response) {
			dispatch({
				type: "CREATE_CROP_FULLFILED",
				payload: true
			})
		})
		.catch(function (error) {
			console.log(error);
			console.log(error.response)
			if (error.response) console.log(error.response.data)
			dispatch({
				type: "CREATE_CROP_REJECTED",
				payload: error.response ? error.response : true
			})
		});

	}
}

export function upsertSensor(user, sensor){
	return dispatch => {

		axios.defaults.headers.common['uid'] = user.Id;
		axios.post('/upsert/sensor', sensor)
		.then(function (response) {
			dispatch({
				type: "CREATE_SENSOR_FULLFILED",
				payload: true
			})
		})
		.catch(function (error) {
			// console.log(error);
			// console.log(error.response)
			// if (error.response) console.log(error.response.data)
			dispatch({
				type: "CREATE_SENSOR_REJECTED",
				payload: error.response ? error.response : true
			})
		});

	}
}

/*@example
readCrop({
	"cid": "-KeKVCaIitfwzQZeBr26",
},{
	"Id": "-KfnVBNQdc9nPs-MtMGx"
})
*/
export function readCrop(user, cropid){
	return dispatch => {
		// console.log('Company/' + user.cid + '/Crops/' + cropid)
		utils.db.ref('Company/' + user.cid + '/Crops/' + cropid ).once('value', function(snapshot) {
			var c = snapshot.val()
			if (c) c.Id = cropid
			
			return dispatch({
				type: "READ_CROP_FULLFILED",
				payload: c
			})
		}).catch(function (err) {
			console.log(err)
		})
	}
}

/*@example
readCrops({
	"cid": "-KeKVCaIitfwzQZeBr26"
}))
*/
export function readCrops(user, option){
	return dispatch => {
		if (option == 'Recently') {
			utils.db.ref('Company/' + user.cid + '/Crops').once('child_added', function(snapshot) {
				var crops = pushCrops(snapshot, [])
				return dispatch({
					type: "READ_CROPS_FULLFILED",
					payload: crops
				}) 
			});
			utils.db.ref('Company/' + user.cid + '/Crops').once('child_changed', function(snapshot) {
				var crops = pushCrops(snapshot, [])
				return dispatch({
					type: "READ_CROPS_FULLFILED",
					payload: crops
				}) 
			});	
		}

		if (option == 'All') {
			utils.db.ref('Company/' + user.cid + '/Crops').limitToFirst(100).once('value', function(snapshot) {
				var crops = pushCrops(snapshot, [])
				return dispatch({
					type: "READ_CROPS_FULLFILED",
					payload: crops
				}) 
			});
		}
		
	}
}

function pushCrops(snapshot, crops){
	var c = {}
	if (snapshot.key != 'Crops'){
		c = snapshot.val()
		c.Id = snapshot.key
		crops.push(c)
	} 
	else{
		snapshot.forEach(function(childSnapshot) {
			c = childSnapshot.val()
			c.Id = childSnapshot.key
			crops.push(c)
		});	
	}
	
	return crops
}

/*@example
updateCrop({
  "cid": "-KeKVCaIitfwzQZeBr26",
  "profile": "Admin"	
 },{
	"Area": "10",
	"Id":"-KfnUY1v6K3RzR6TDv0a",
	"StartDate": "2016-09-30",
	"CropVariety": "CC01-1940",
	"IrrigationType": "Multicompuertas",
	"FieldCapacity": 90,
	"Lara": 100,
	"isCalculate": true,
	"Name": "Test Crop Update"
	})
*/
export function updateCrop(user, crop){
	return dispatch => {
		if (!user.profile || user.profile == 'Visit') {
			return dispatch({
				type: "UPDATE_CROP_REJECTED",
				payload: 'Usuario no autorizado'
			})
		}
		const ref = utils.db.ref('Company/' + user.cid + '/Crops/' + crop.Id + '/')

		ref.once('value', function(snapshot){
			if (!snapshot.val()) {
				return dispatch({
					type: "UPDATE_CROP_REJECTED",
					payload: 'Cultivo no encontrado'
				})
			}

			var c = {}

			if (user.profile == 'Admin' && crop.isCalculate == false) {
				c.Area = crop.Area || 0
				c.FieldCapacity = crop.FieldCapacity || 0
				c.Lara = crop.Lara || 0
				c.isCalculate = crop.isCalculate || crop.isCalculate == false ? crop.isCalculate : true
			}

			c.StartDate = crop.StartDate || ''
			c.CropVariety = crop.CropVariety || ''
			c.IrrigationType = crop.IrrigationType || ''
			c.Name = crop.Name || ''
			c.ModifyBy = user.Name || 'Guest'
			c.ModifyDate = utils.moment().format('YYYY/MM/DD HH:mm')
			
			ref.update(c)

			return dispatch({
				type: "UPDATE_CROPS_FULLFILED",
				payload: c
			}) 

		})
		
	}
}



/*@example
deleteCrop({
  "cid": "-KeKVCaIitfwzQZeBr26",
  "profile": "Admin"	
 },{
	"Id":"-KfnUY1v6K3RzR6TDv0a"
	})
*/
export function deleteCrop(user, crop){
	return dispatch => {
		if(user.profile != 'Admin'){
			return dispatch({
				type: "UPDATE_CROP_REJECTED",
				payload: 'Usuario no autorizado'
			})
		}

		utils.db.ref('Company/' + user.cid + '/Crops/' + crop.Id + '/').remove()

		return dispatch({
			type: "DELETE_CROP_REJECTED",
			payload: 'EL cultivo se ha eliminado'
		})
	}
}

/*Action Lote*/
/*@example
createLote({
  "cid": "-KeKVCaIitfwzQZeBr26",
  "profile": "Admin",
  "Name": "Ana Maria Cabrera"	
 },{
	"Id":"-KfnVBNQdc9nPs-MtMGx",
	"Lara": 57,
	"isCalculate": true,
	"FieldCapacity": 114,
	"Area": 9250
	}, {
			"Area": "10",
			"StartDate": "2016-09-31",
			"FieldCapacity": 114,
			"Lara": 57,
			"FieldType": "seco",
			"Variables": {
				"Evaporation": {
					"2016-09-31": {
						"Average" : 3.7,
						"Values": {
							"2016-09-31-09-10-00": 101.07,
							"2016-09-31-10-10-00": 101.07
						}
					}
				}
			}
		})
*/
export function createLote(user, crop, lote){
	return dispatch => {
		if (!user.profile || user.profile === 'Visit') {
			return dispatch({
				type: "CREATE_LOTE_REJECTED",
				payload: 'Usuario no autorizado'
			})
		}
		const ref = utils.db.ref('Company/'+ user.cid +'/Crops/'+ crop.Id +'/Lotes').push()
		const refCrop = utils.db.ref('Company/'+ user.cid +'/Crops/'+ crop.Id +'/')

		var l = {}

		l.Name = lote.Name || ''
		l.Area = lote.Area || 0
		l.Lara = lote.Lara || 0
		l.FieldType = lote.FieldType || ''
		l.FieldCapacity = lote.FieldCapacity || 0
		l.StartDate = lote.StartDate || ''
		l.CreateBy = user.Name || 'Guest'
		l.CreateDate = utils.moment().format('YYYY/MM/DD HH:mm')
		l.ModifyBy = user.Name || 'Guest'
		l.ModifyDate = utils.moment().format('YYYY/MM/DD HH:mm')
		
		ref.set(l)

		if (crop.isCalculate == true) {
			var c = {}
			c.Lara = (crop.Lara + l.Lara)/2
			c.FieldCapacity = (crop.FieldCapacity + l.FieldCapacity)/2
			c.Area = crop.Area + l.Area
			refCrop.update(c)
		}		

		return dispatch({
			type: "CREATE_LOTE_FULLFILED",
			payload: l
		})

	}
}
/*@example
readLote({
  "cid": "-KeKVCaIitfwzQZeBr26",
 },{
	"Id":"-KfnVBNQdc9nPs-MtMGx",
	}, {
	"Id": "0"
	})
*/
export function readLote(user, crop, lote){
	return dispatch => {
		utils.db.ref('Company/' + user.cid + '/Crops/' + crop + '/Lotes/' + lote).on('value', function(snapshot) {
			return dispatch({
				type: "READ_LOTE_FULLFILED",
				payload: snapshot.val()
			})
		})
	}
}

export function readVariables(user){
	return dispatch => {
		utils.db.ref('Company/' + user.cid + '/Variables/').on('value', function(snapshot) {
			return dispatch({
				type: "READ_VARIABLES_FULLFILED",
				payload: snapshot.val()
			})
		})
	}
}

export function readSensors(user){
	return dispatch => {
		utils.db.ref('Company/' + user.cid + '/Sensors/').on('value', function(snapshot) {
			return dispatch({
				type: "READ_SENSORS_FULLFILED",
				payload: snapshot.val()
			})
		})
	}
}

export function readVars(user, crop, lote, vars){
	return dispatch => {
		utils.db.ref('Company/' + user.cid + '/Crops/' + crop + '/Lotes/' + lote + '/Variables/'+ vars).on('value', function(snapshot) {
			return dispatch({
				type: "READ_VARS_FULLFILED",
				payload: snapshot.val()
			})
		})
	}
}

/*@example
updateLote({
  "cid": "-KeKVCaIitfwzQZeBr26",
  "profile": "Admin",
  "Name": "Ana Maria Cabrera"	
 },{
	"Id":"-KfnVBNQdc9nPs-MtMGx",
	"Lara": 57,
	"isCalculate": true,
	"FieldCapacity": 114,
	"Area": 9250
	}, {
		"Area": "20",
		"StartDate": "2016-09-31",
		"FieldCapacity": 214,
		"Lara": 60,
		"FieldType": "seco",
		"Id": "0"
	})
*/
export function updateLote(user, crop, lote){
	return dispatch => {
		
		if (!user.profile || user.profile == 'Visit') {
			return dispatch({
				type: "UPDATE_LOTE_REJECTED",
				payload: 'Usuario no autorizado'
			})
		}

		const ref = utils.db.ref('Company/' + user.cid + '/Crops/' + crop.Id + '/Lotes/'+lote.Id)
		var l = {}

		ref.once('value', function(snapshot){
			if (!snapshot.val()) {
				return dispatch({
					type: "UPDATE_LOTE_REJECTED",
					payload: 'Lote no encontrado'
				})
			}

			l.Name = lote.Name || ''
			l.Area = lote.Area || 0
			l.Lara = lote.Lara || 0
			l.FieldType = lote.FieldType || ''
			l.FieldCapacity = lote.FieldCapacity || 0
			l.StartDate = lote.StartDate || ''
			l.ModifyBy = user.Name || 'Guest'
			l.ModifyDate = utils.moment().format('YYYY/MM/DD HH:mm')
			
			ref.update(l)
			
			if (crop.isCalculate == true) triggerLoteCalculateCrop(user, crop)

			return dispatch({
				type: "UPDATE_LOTE_FULLFILED",
				payload: l
			}) 
			

		})

		
	}
}

/*@example
deleteLote({
  "cid": "-KeKVCaIitfwzQZeBr26",
  "profile": "Admin",
  "Name": "Ana Maria Cabrera"	
 },{
	"Id":"-KfnVBNQdc9nPs-MtMGx",
	"isCalculate": true,
	}, {
		"Id": "0"
	})
*/
export function deleteLote(user, crop, lote){
	return dispatch => {
		if(user.profile != 'Admin'){
			return dispatch({
				type: "DELETE_LOTE_REJECTED",
				payload: 'Usuario no autorizado'
			})
		}

		utils.db.ref('Company/' + user.cid + '/Crops/' + crop.Id + '/Lotes/'+lote.Id).remove()

		if (crop.isCalculate == true) triggerLoteCalculateCrop(user, crop)

		return dispatch({
			type: "DELETE_LOTE_REJECTED",
			payload: 'EL cultivo se ha eliminado'
		})
	}
}

function triggerLoteCalculateCrop(user, crop){
	const refLots = utils.db.ref('Company/' + user.cid + '/Crops/' + crop.Id + '/Lotes')
	const refCrop = utils.db.ref('Company/' + user.cid + '/Crops/' + crop.Id )
	
	refLots.once('value', function(snapshot){
		const lotesKeys = Object.keys(snapshot.val())
		var c = {
			Lara: 0,
			Area: 0,
			FieldCapacity: 0
		}
		for (var i = lotesKeys.length - 1; i >= 0; i--) {
			lotesKeys[i]
			c.Lara = c.Lara + parseInt(snapshot.val()[lotesKeys[i]].Lara)
			c.FieldCapacity = c.FieldCapacity + parseInt(snapshot.val()[lotesKeys[i]].FieldCapacity)
			c.Area = c.Area + parseInt(snapshot.val()[lotesKeys[i]].Area)
	 		if (i == 0) {
				c.Lara = c.Lara / lotesKeys.length
				c.FieldCapacity = c.FieldCapacity / lotesKeys.length
				
			}
		}

		refCrop.update(c)

	})
}
/*Action Variable*/
/*@example
addVariable({
	"cid": "-KeKVCaIitfwzQZeBr26",
	"profile": "Admin",
	"Name": "Ana Maria Cabrera"	
	},{
	"Id":"-KfnVBNQdc9nPs-MtMGx",
	}, {
		"Id": "-KfvsG02Ey410fPYfJlE"
},{
   Name:"Evaporation",
   ApiName:"Evaporation",
   Min: 0,
   Max: 100,
   Values: {
		"2016-09-31": {
			"Average" : 3.7,
			"Values": {
				"2016-09-31 09:10:00": 101.07,
				"2016-09-31 10:10:00": 101.07
			}
		}
	}
}
)
*/
export function addVariable(user, crop, lote, variable) {
	return dispatch => {
		if (user.profile == 'Visit') {
			return dispatch({
				type: "CREATE_LOTE_REJECTED",
				payload: 'Usuario no autorizado'
			})
		}
		var ref = utils.db.ref('Company/' + user.cid + '/Crops/' + crop.Id + '/Lotes/' + lote.Id + '/Variables/' + variable.ApiName)
		var refVar = utils.db.ref('Company/' + user.cid + '/Variables')

		refVar.once('value', function(snapshot){

			if (!snapshot.val()[variable.ApiName]) {
				return dispatch({
					type: "CREATE_LOTE_REJECTED",
					payload: 'variable no existente'
				})
			}

			var v = {}
			v.Values = {}
			v.Name = variable.Name
			v.ApiName = variable.ApiName
			v.Min = variable.Min || snapshot.val()[variable.ApiName].Min
			v.Max = variable.Max || snapshot.val()[variable.ApiName].Max
			v.CreateBy = user.Name || 'Guest'
			v.CreateDate = utils.moment().format('YYYY/MM/DD HH:mm')
			v.ModifyBy = user.Name || 'Guest'
			v.ModifyDate = utils.moment().format('YYYY/MM/DD HH:mm')
						
			if (variable.Values) {
				const dates = Object.keys(variable.Values)

				for (var i = dates.length - 1; i >= 0; i--) {

					v.Values[dates[i]] = variable.Values[dates[i]]	
					v.Values[dates[i]].Average = 0
					const values = Object.keys(v.Values[dates[i]].Values)
					for (var j = values.length - 1; j >= 0; j--) {
						v.Values[dates[i]].Average = v.Values[dates[i]].Average + v.Values[dates[i]].Values[values[j]]
						if (j==0) {
							v.Values[dates[i]].Average = v.Values[dates[i]].Average / values.length
							if (v.Values[dates[i]].Average < v.Min) {
								v.Values[dates[i]].Alert = 'Valor menor al minimo'
							}
							if (v.Values[dates[i]].Average > v.Max) {
								v.Values[dates[i]].Alert = 'Valor mayor al maximo'
							}
						} 
					}
					
				}
			}
			
			ref.set(v)

			return dispatch({
				type: "CREATE_VARIABLE_FULLFILED",
				payload: v
			})

		})
		
	}
}

/*@example
readVariable({
	"cid": "-KeKVCaIitfwzQZeBr26",
	},{
	"Id":"-KfnVBNQdc9nPs-MtMGx",
	}, {
		"Id": "-KfvsG02Ey410fPYfJlE"
	},{
   ApiName:"Evaporation"
	}
)
*/
export function readVariable(user, crop, lote, valriable){
	return dispatch => {
		utils.db.ref('Company/' + user.cid + '/Crops/' + crop.Id + '/Lotes/' + lote.Id + '/Variables/' + valriable.ApiName).on('value', function(snapshot) {
			return dispatch({
				type: "READ_VARIABLE_FULLFILED",
				payload: snapshot.val()
			})
		});
	}
}

/*@example
updateVariable({
	"cid": "-KeKVCaIitfwzQZeBr26",
	"profile": "Admin",
	"Name": "Ana Maria Cabrera"	
	},{
	"Id":"-KfnVBNQdc9nPs-MtMGx",
	}, {
		"Id": "-KfvsG02Ey410fPYfJlE"
},{
   Name:"Evaporation",
   ApiName:"Evaporation",
   Min: 0,
   Max: 150
}
)
*/
export function updateVariable(user, crop, lote, variable){
	return dispatch => {
		if (user.profile == 'Visit') {
			return dispatch({
				type: "UPDATE_VARIABLE_REJECTED",
				payload: 'Usuario no autorizado'
			})
		}
		var ref = utils.db.ref('Company/' + user.cid + '/Crops/' + crop.Id + '/Lotes/' + lote.Id + '/Variables/' + variable.ApiName)

		ref.once('value', function(snapshot){

			if (!snapshot.val()) {
				return dispatch({
					type: "UPDATE_VARIABLE_REJECTED",
					payload: 'Variable no encontrada'
				})
			}

			var v = {}
			v.Values = {}
			v.Name = variable.Name || snapshot.val().Name
			v.Min = variable.Min || snapshot.val().Min
			v.Max = variable.Max || snapshot.val().Max
			v.ModifyBy = user.Name || 'Guest'
			v.ModifyDate = utils.moment().format('YYYY/MM/DD HH:mm')			

			ref.update(v)

			return dispatch({
				type: "UPDATE_VARIABLE_FULLFILED",
				payload: v
			})

		})
		
	}
}

/*@example
deleteVariable({
	"cid": "-KeKVCaIitfwzQZeBr26",
	"profile": "Admin",
	"Name": "Ana Maria Cabrera"
	},{
	"Id":"-KfnVBNQdc9nPs-MtMGx",
	}, {
		"Id": "-KfvsG02Ey410fPYfJlE"
	},{
   ApiName:"Evaporation"
	}
)
*/
export function deleteVariable(user, crop, lote, variable){
	return dispatch => {
		if(user.profile != 'Admin'){
			return dispatch({
				type: "DELETE_VARIABLE_REJECTED",
				payload: 'Usuario no autorizado'
			})
		}

		utils.db.ref('Company/' + user.cid + '/Crops/' + crop.Id + '/Lotes/' + lote.Id + '/Variables/' + variable.ApiName).remove()

		return dispatch({
			type: "DELETE_VARIABLE_REJECTED",
			payload: 'La variable se ha eliminado'
		})
	}
}

/*Action Sensor*/
/*@example
addSensorToLote({
	"cid": "-KeKVCaIitfwzQZeBr26",
	"profile": "Admin",
	"Name": "Ana Maria Cabrera"
	},{
	"Id":"-KfnVBNQdc9nPs-MtMGx",
	}, {
		"Id": "-KfvsG02Ey410fPYfJlE"
	},{
   ApiName:"Evaporation"
	},{
		Name: 'Test',
		Id: "-KfvsG00Ey000fPYfJlE"
	}
)
*/
export function addSensorToLote(user, crop, lote, variable, sensor){
	console.log('addSensorToLote')
	return dispatch => {
		if (!user.cid || !user.profile || user.profile == 'Visit') {
			return dispatch({
				type: "ADD_SENSOR_REJECTED",
				payload: 'Usuario no autorizado'
			})
		}
		var ref = utils.db.ref('Company/' + user.cid + '/Sensors/' + sensor.Id)
		ref.once('value').then(function(snapshot) {
			var _s = snapshot.val() || {}
		 	if (_s.Status == 'active' || _s.CreateBy) {
		 		return dispatch({
					type: "ADD_SENSOR_REJECTED",
					payload: _s
				})
		 	}

			var s = {}

			s.Name = sensor.Name || ''
			s.Id = sensor.Id || ref.key
			s.Crop = crop.id || ''
			s.Lote = lote.id || ''
			s.Variable = variable.ApiName || ''
			s.Status = 'disabled'
			s.ModifyBy = user.Name || 'Guest'
			s.ModifyDate = utils.moment().format('YYYY/MM/DD HH:mm')
			s.CreateBy = user.Name || 'Guest'
			s.CreateDate = utils.moment().format('YYYY/MM/DD HH:mm')

			ref.set(s)

			var refS = utils.db.ref('Sensors/'+sensor.Id)

			var _s = {
				Company: user.cid
			}
			refS.set(_s)

			ref.on('value', function(snapshot) {
				var _s = snapshot.val() || {}
				if (_s.Status == 'active') {
					console.log(_s.Status)
					return dispatch({
						type: "ADD_SENSOR_FULLFILED",
						payload: _s
					})
				}
			})

		}).catch(function (err) {
			console.log(err)
		});

	}
}

/*@example
updateSensorToLote({
	"cid": "-KeKVCaIitfwzQZeBr26",
	"profile": "Admin",
	"Name": "Ana Maria Cabrera"
	},{
	"Id":"-KfnVBNQdc9nPs-MtMGx",
	}, {
		"Id": "-KfvsG02Ey410fPYfJlE"
	},{
   ApiName:"Evaporation"
	},{
		Name: 'Test',
		Id: "-KfvsG00Ey000fPYfJlE",
		Status: 'disabled'
	}
)
*/
export function updateSensorToLote(user, crop, lote, variable, sensor){
	return dispatch => {
		if (!user.profile || user.profile == 'Visit') {
			return dispatch({
				type: "UPDATE_SENSOR_REJECTED",
				payload: 'Usuario no autorizado'
			})
		}
		var ref = utils.db.ref('Company/' + user.cid + '/Sensors/' + sensor.Id)
		ref.once('value').then(function(snapshot) {
			console.log('create...')
			var _s = snapshot.val()
		 	if (!_s) {
		 		return dispatch({
					type: "UPDATE_SENSOR_REJECTED",
					payload:'Sensor no existente'
				})
		 	}

			var s = {}

			s.Name = sensor.Name || _s.Name
			s.Crop = crop.Id || _s.Crop
			s.Lote = lote.Id || _s.Lote
			s.Variable = variable.ApiName || _s.Variable
			s.Status = sensor.Status == 'disabled' ? sensor.Status : _s.Status
			s.ModifyBy = user.Name || 'Guest'
			s.ModifyDate = utils.moment().format('YYYY/MM/DD HH:mm')
			
			ref.update(s)

			if (sensor.Status != _s.Variable && sensor.Status == 'active') {
				ref.on('value', function(snapshot) {
					console.log('next...')
					var _s = snapshot.val() || {}
					if (_s.Status == 'active') {
						console.log(_s.Status)
						return dispatch({
							type: "ADD_SENSOR_FULLFILED",
							payload: _s
						})
					}
				})
			}

		});

	}
}

/*@example
deleteSensor({
	"cid": "-KeKVCaIitfwzQZeBr26",
	"profile": "Admin",
	"Name": "Ana Maria Cabrera"
	},{
		Id: "-KfvsG00Ey000fPYfJlE",
	}
)
*/
export function deleteSensor(user, sensor){

	return dispatch => {
		if(user.profile != 'Admin'){
			return dispatch({
				type: "DELETE_SENSOR_REJECTED",
				payload: 'Usuario no autorizado'
			})
		}

		utils.db.ref('Company/' + user.cid + '/Sensors/' + sensor.Id).remove()
		utils.db.ref('Sensors/' + sensor.Id).remove()

		return dispatch({
			type: "DELETE_SENSOR_FULLFILED",
			payload: 'EL sensor se ha eliminado'
		})
	}

}

export function addVariableValue(user, crop, lote, variable, value) {
	return dispatch => {
		if (!user.profile || user.profile == 'Visit') {
			return dispatch({
				type: "UPDATE_SENSOR_REJECTED",
				payload: 'Usuario no autorizado'
			})
		}

		var ref = utils.db.ref('Company/' + user.cid + '/Crops/' + crop.Id + '/Lotes/' + lote.Id + '/Variables/' + variable.ApiName)

		ref.once('value').then(function (variableInfo) {
			
			if (variableInfo.val() == null) {
				return dispatch({
					type: "ADD_VARIABLE_VALUE_REJECTED",
					payload:{
						status: 404,
						code: 'NotFoundVariableInfo',
						message: '¡Lo sentimos! La variable no tiene informacion existe en el store. Por favor intente con otro lote o cree la variable a este'
					}
				})
			}

			var date = value.date.split(' ')[0]
			var o = {}
			var c_Alert = ''
			var c_Values = 0

			if (variableInfo.val().Values[date]) {
				
				c_Values = variableInfo.val().Values[date].Values
				c_Values[value.date] = parseInt(value.value)

				var c_Average = (variableInfo.val().Values[date].Average + parseInt(value.value)) / 2
					
				if (c_Average > variableInfo.val().Max) c_Alert = 'Valor mayor al maximo'
				if (c_Average < variableInfo.val().Min) c_Alert = 'Valor menor al minimo'

				o[date] = {
					Alert: c_Alert,
					Values: c_Values,
					Average: c_Average
				}
				
			} else {
				c_Values = parseInt(value.value)
				if (c_Values > variableInfo.val().Max) c_Alert = 'Valor mayor al maximo'
				if (c_Values < variableInfo.val().Min) c_Alert = 'Valor menor al minimo'
				
				o[date] = {
					Alert: c_Alert,
					Average: c_Values
				}
				o[date].Values[value.date] = parseInt(c_Values)
			}

			vRef.update(o)

			return dispatch({
				type: "ADD_VARIABLE_VALUE_REJECTED",
				payload:{
					status: 200,
					code: 'UpdateVariable',
					message: 'La variable '+variable.ApiName+' a sido actualizada'
				}
			})


		}).catch(function (err) {
			console.log(err)
			return dispatch({
					type: "ADD_VARIABLE_VALUE_REJECTED",
					payload:err
				})
		})

	}
}
