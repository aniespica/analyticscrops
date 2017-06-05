var fb = require('firebase-admin'),
		moment = require('moment'),
		triggerValue = require('./trigger-value'),
		triggerVariable = require('./trigger-variables');

module.exports = {

	deleteValue: (req, res) => {

		const {body, headers, protocol} = req,
		{cropid, loteid, varid, date} = body;
		let auth = fb.auth(),
		database = fb.database();

		auth.getUser(headers.uid)
		.then(function(userRecord) {
			const {photoURL} = userRecord

			if (photoURL) {
				const data = JSON.parse(photoURL);
				
				if (data.profile === 'Admin' || data.profile === 'Register') {

					if (!cropid || !loteid || !varid || !date) {
						return res.status(400).json({
							code: "Missing_Data",
							status: 400,
							message: 'Los campos cropid, loteid, varid, date son requerido para eliminar un valor',
							request: 'addLote'
						})
					}

					if (date.indexOf(moment(date,'YYYY-MM-DD').format('YYYY-MM-DD')) < 0){
						return res.status(400).json({
							code: "Bad_Data",
							status: 400,
							message: 'El usuario ingreso un date invalido el formato debe ser: YYYY-MM-DD',
							request: 'addLote'
						})
					}

					let ref = database.ref('Company/'+data.cid+'/Crops/'+cropid+'/Lotes/'+loteid+'/Variables/'+varid+'/Values/'+date)
					ref.remove()
					
					return res.status(200).json({
						code:"Success",
						status: 200,
						message: 'El sensor a sido eliminada exitosamente'
					})

				}
			}

		})

	},

	deleteSensor: (req, res) => {

		const {body, headers, protocol} = req,
		{serial} = body;
		let auth = fb.auth(),
		database = fb.database();

		auth.getUser(headers.uid)
		.then(function(userRecord) {
			const {photoURL} = userRecord

			if (photoURL) {
				const data = JSON.parse(photoURL);
				
				if (data.profile === 'Admin' || data.profile === 'Register') {

					if (!serial) {
						return res.status(400).json({
							code: "Missing_Data",
							status: 400,
							message: 'El serial es requerido para eliminar un sensor',
							request: 'addLote'
						})
					}

					let ref = database.ref('Sensors/'+serial)
					let refSerial = database.ref('Company/'+data.cid+'/Sensors/'+serial)
					ref.remove()
					refSerial.remove()

					return res.status(200).json({
						code:"Success",
						status: 200,
						message: 'El sensor a sido eliminada exitosamente'
					})

				}
			}

		})

	},

	deleteVariable: (req, res) => {
		const {body, headers, protocol} = req,
		{variableApiName} = body;
		let auth = fb.auth(),
		database = fb.database();
		auth.getUser(headers.uid)
		.then(function(userRecord) {
			const {photoURL} = userRecord

			if (photoURL) {
				const data = JSON.parse(photoURL);
				
				if (data.profile === 'Admin' || data.profile === 'Register') {

					if (!variableApiName || (variableApiName.length - variableApiName.search("__c") != 3)) {
						console.log("no delete")
						return res.status(400).json({
							code: "Missing_Data",
							status: 400,
							message: 'El usuario no puede eliminar variables del sistema que no sean personalizadas',
							request: 'addLote'
						})
					}

					let ref = database.ref('Company/'+data.cid+'/Variables/'+variableApiName)
					let refCrops = database.ref('Company/'+data.cid+'/Crops')

					ref.remove()

					refCrops.once("value", function (snapshot) {
						var crops = snapshot.val()

						snapshot.forEach(function(childSnapshot){
							let crop = childSnapshot.val()
							for(var i in crop.Lotes){
								var lote = crop.Lotes[i]
								
								if (lote.Variables && lote.Variables[variableApiName]){
									database.ref('Company/'+data.cid+'/Crops/'+childSnapshot.key+'/Lotes/'+i+'/Variables/'+variableApiName).remove()
								}
							}

						})
					})

					return res.status(200).json({
						code:"Success",
						status: 200,
						message: 'La variable a sido eliminada exitosamente'
					})
				}
			}
		})

	},

	addSensor: (req, res) => {
		const {body, headers, protocol} = req,
		{Serial, Crop, Variable, Lotes, Name } = body;
		let auth = fb.auth(),
		database = fb.database();

		auth.getUser(headers.uid)
		.then(function(userRecord) {
			const {photoURL} = userRecord

			if (photoURL && Serial) {
				const data = JSON.parse(photoURL);
				
				if (data.profile === 'Admin' || data.profile === 'Register') {

					if (!Serial) {
						return res.status(400).json({
							code: "Missing_Data",
							status: 400,
							message: 'El usuario le falta el campo Serial es un campo requerido',
							request: 'addLote'
						})
					}

					let ref = database.ref('Company/'+data.cid+'/Sensors/'+Serial)

					return ref.once('value', function(s){
						

							var values = {},
							date = moment().utc().format('YYYY-MM-DD HH:mm:ss');

							if (Crop) values.Crop = Crop
							if (Variable) values.Variable = Variable
							if (Name) values.Name = Name
							if (userRecord.displayName) values.ModifyBy = userRecord.displayName
							if (date) values.ModifyDate = date

							if (!s.val()) {
								if (Lotes) values.Lotes = Array.isArray(Lotes) ? JSON.stringify(Lotes) : JSON.stringify([Lotes])
								if (Serial) values.Id = Serial
								if (date) values.CreateDate = date
								if (userRecord.displayName) values.CreateBy = userRecord.displayName
								
								let sRef = database.ref('Sensors/'+Serial)

								sRef.set({
									company: data.cid
								})
								ref.set(values)

								return res.status(201).json({
									code: 'Sensor_Created',
									status: 201,
									message: 'El sensor se a añadido al sistema'
								})

							}else{
								values.Lotes = JSON.parse(s.val().Lotes)

								if (Crop != s.val().Crop) {
									if (Lotes) values.Lotes = Array.isArray(Lotes) ? JSON.stringify(Lotes) : JSON.stringify([Lotes])
								}else{
									if (Lotes) {
										if (!values.Lotes.includes(Lotes)) {
											if(Array.isArray(Lotes)){
												// console.log(values.Lotes.concat(Lotes))
												values.Lotes = JSON.stringify(values.Lotes.concat(Lotes))
											}else{
												values.Lotes.push(Lotes)
												values.Lotes = JSON.stringify(values.Lotes)
											}
										}else{
											values.Lotes = s.val().Lotes
										}
									}	
								}
								 
								if (s.val().Id != Serial) {
									return res.status(404).json({
										code: "Sensor_NoFound",
										status: 404,
										message: 'El sensor no se encontro',
										request: 'addSensor'
									})
								}

								ref.update(values)

								return res.status(200).json({
									code: 'Sensor_Modify',
									status: 200,
									message: 'El sensor se a modificado'
								})

							}
					})
					

				}else{
					return res.status(401).json({
						code: "User_Unauthorized",
						status: 401,
						message: 'El usuario no esta autorizado para realizar esta acción',
						request: 'addCrop'
					})
				}
			}

			res.status(400).json({
				code: "Missing_Data",
				status: 400,
				message: 'El usuario le falta el Serial o no existe en la compañia',
				request: 'addSensor'
			})

		}).catch(function(error) {
			console.log("Error fetching user data:", error);
			res.send('T.T');
		})

	},

	addValueSensor: (req, res) => {

		const {body, protocol} = req,
		{date, items } = body;
		let database = fb.database()

		if (!items || !Array.isArray(items)) {
			return res.status(400).json({
				code: "Missing_Data",
				status: 400,
				message: 'El usuario le falta el campo items es un campo requerido y este debe ser un arreglo',
				request: 'addLote'
			})
		}

		if (date.indexOf(moment(date,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')) < 0){
			return res.status(400).json({
				code: "Bad_Data",
				status: 400,
				message: 'El usuario ingreso un date invalido',
				request: 'addLote'
			})
		}


		let ref = database.ref('Sensors')

		ref.once('value', function(s){

			var sensors = s.val();

			function upsertValue(k){

				if (items.length == k ) {
					return
				}

				var serial = items[k].serial,
				value = items[k].value,
				sensor = sensors[serial]; 

				if (!sensor) {
					return res.status(400).json({
						code: "Serial_NoFound",
						status: 400,
						message: 'El serial ingresado no pertenece a ningun sensor del sistema',
						request: 'addValueSensor'
					})		
				}

				let sRef = database.ref('Company/'+sensor.company+'/Sensors/'+serial)
				sRef.once('value', function (snapshot) {
					
					if (!snapshot.val()) {
						return res.status(400).json({
							code: "Serial_NoFound",
							status: 400,
							message: 'El serial ingresado no pertenece a ningun sensor del sistema',
							request: 'addValueSensor'
						})		
					}

					let lotes = JSON.parse(snapshot.val().Lotes),
					crop = snapshot.val().Crop,
					variable = snapshot.val().Variable;
					function addValue(i) {

						if (lotes.length == i ) {
							upsertValue(k + 1)
							return
						}

						let vRef = database.ref('Company/'+sensor.company+'/Crops/'+crop+'/Lotes/'+lotes[i]+'/Variables/'+variable)

						vRef.once('value', function(snapVal){
							var vals = snapVal.val();
							let currentDate = date.split(' ')[0]

							if (!vals.Values) {

								vals.Values = {}

								vals.Values[currentDate] = {
									Average: value,
									Values: {}
								}

								vals.Values[currentDate].Values[date] = value

								vRef.update(vals, function (err) {
									// console.log(err);
									addValue(i + 1)
								})

							} else {

								if (!vals.Values[currentDate]) {
									
									vals.Values[currentDate] = {
										Average: value,
										Values: {}
									}

									vals.Values[currentDate].Values[date] = value

									vRef.update(vals, function (err) {
										// console.log(err);
										addValue(i + 1)
									})

								} else {
									vals.Values[currentDate].Values[date] = value
									let keys = Object.keys(vals.Values[currentDate].Values)
									var result = 0
									
									for (var j = keys.length - 1; j >= 0; j--) {
										result = result + vals.Values[currentDate].Values[keys[j]]
									}
									vals.Values[currentDate].Average = result / keys.length
									vRef.update(vals, function (err) {
										// console.log(err);
										addValue(i + 1)
									})

								}

							}
						})

					}

					addValue(0)

					if (k == 0) {
						return res.status(200).json({
							code: 'Sensor_Value_Add',
							status: 200,
							message: 'El valor se a añadido exitosamente en la variable'+variable
						})	
					}

				})
			}

			upsertValue(0)

		})

	},

	addValue: (req, res) => {
		const {body, headers, protocol} = req,
		{StringDate, Value, varid, cropid, loteid} = body;
		let auth = fb.auth(),
		database = fb.database();

		auth.getUser(headers.uid)
		.then(function(userRecord) {
			const {photoURL} = userRecord

			if (photoURL && cropid) {
				const data = JSON.parse(photoURL);
				
				if (data.profile === 'Admin' || data.profile === 'Register') {

					if (!Value || !StringDate) {
						res.setHeader("Error", "El usuario le falta el campo Value o StringDate son campos requeridos");
						return res.status(400).json({
							code: "Missing_Data",
							status: 400,
							message: 'El usuario le falta el campo Value o StringDate son campos requeridos',
							request: 'addLote'
						})
					}

					if (StringDate.indexOf(moment(StringDate,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')) < 0){
						res.setHeader("Error", "El usuario ingreso un StringDate invalido");
						return res.status(400).json({
							code: "Bad_Data",
							status: 400,
							message: 'El usuario ingreso un StringDate invalido',
							request: 'addLote'
						})
					}

					let ref = database.ref('Company/'+data.cid+'/Crops/'+cropid+'/Lotes/'+loteid)
					val = database.ref('Company/'+data.cid+'/Variables'),
					key = StringDate.split(' ')[0]
					date = moment().utc().format('YYYY-MM-DD HH:mm:ss');
					return ref.once('value', function(v){

						var varVal = v.val().Variables[varid] 

						if (!varVal){
							res.setHeader("Error", "El usuario ingreso una Variable invalida");
							return  res.status(400).json({
								code: "Bad_Data",
								status: 400,
								message: 'El usuario ingreso una Variable invalida',
								request: 'addLote'
							})
						} 


						if (varVal.Formula && !varVal.isModify) {
							res.setHeader("Error", "Esta variable no se le puede añadir valores manualmente");
							return res.status(400).json({
								code: "Variable_Not_Modified",
								status: 400,
								message: 'Esta variable no se le puede añadir valores manualmente',
								request: 'addValue'
							})
						}
						const {Max, Min} = varVal
						varVal = varVal.Values
						
						if (moment(StringDate).utc().valueOf() < moment(v.val().StartDate).utc().valueOf()){
							res.setHeader("Error", "El usuario ingreso un StringDate invalido");
							return res.status(400).json({
								code: "Bad_Data",
								status: 400,
								message: 'El usuario ingreso un StringDate invalido',
								request: 'addLote'
							})
						} 

						if (varVal) {
							if (varVal[key] && varVal[key].Values) {
								varVal[key].Values[StringDate] = parseFloat(Value)
							}else{
								varVal[key] = {Values: {}}
								varVal[key].Values[StringDate] = parseFloat(Value)
							}
						}else{
							varVal = {}
							varVal[key] = {Values: {}}
							varVal[key].Values[StringDate] = parseFloat(Value)
						}

						var Average = 0,
						notificated = null,
						last = Object.keys(varVal[key].Values).length,
						lastValue = Object.keys(varVal)[Object.keys(varVal).length - 1];

						function addValueFB() {
							Object.keys(varVal[key].Values).forEach(function (keyVal) {
								Average += varVal[key].Values[keyVal]
							})

							varVal[key].Average = Average / last;
							if (varVal[key].Average > Max) {
								notificated = 'El lote '+ ref.key +' en la variable '+ varid +' a superado el valor maximo '+Max 
							}
							if (varVal[key].Average < Min) {
								notificated = 'El lote '+ ref.key +' en la variable '+ varid +' a superado el valor maximo '+Min 
							}
							
							database.ref('Company/'+data.cid+'/Crops/'+cropid+'/Lotes/'+loteid+'/Variables/'+varid).update({
								Values: varVal
							}, function (err) {
								console.log(err)
								if (!err) triggerValue.afterInsert(data.cid, cropid, loteid, varid, notificated, varVal[key].Average, StringDate, lastValue)
							})
						}
						
						addValueFB();
						
						return res.status(201).json({
							code: 'Lote_Created',
							status: 201,
							message: 'El valor se a añadido o se esta añadiendo a la variable '+varid,
							url: protocol + '://' + headers.host + '/crops/'+ cropid + '/lotes/' + ref.key + '/variables/' + varid + '/date/' + key,
						})

					})

				}else{
					return res.status(401).json({
						code: "User_Unauthorized",
						status: 401,
						message: 'El usuario no esta autorizado para realizar esta acción',
						request: 'addCrop'
					})
				}
				
			}
			
			res.status(400).json({
				code: "Missing_Data",
				status: 400,
				message: 'El usuario le falta el cropid o no existe en la compañia',
				request: 'addLote'
			})
		})
		.catch(function(error) {
			console.log("Error fetching user data:", error);
			res.send('T.T');
		});

	},

	addVariable: (req, res) => {

		const {body, headers, protocol} = req,
		{Max, Min, isCalculate, Alert, Formula, isModify, Sensor} = body;
		// console.log(body)
		let auth = fb.auth(),
		database = fb.database();
		var Name = body.Name.replace(/ /g, '_');
		auth.getUser(headers.uid)
		.then(function(userRecord) {
			const {photoURL} = userRecord

			if (photoURL) {
				const data = JSON.parse(photoURL);

				if (data.profile === 'Admin' || data.profile === 'Register') {

					let val = database.ref('Company/'+data.cid+'/Variables'),
					date = moment().utc().format('YYYY-MM-DD HH:mm:ss');
					
					return val.once('value', function(v){
						var Variables = v.val();

						if (v.val()) {
							
							if (Variables[Name] && !Name.includes('__c')) {
								// console.log(Variables[Name])
								// console.log(!Name.includes('__c'))
								return res.status(404).json({
										code: "Variable_Not_Modified",
										status: 404,
										message: 'La variable '+Name+' no es modificable',
										request: 'addVariable'
									})
							}

							var Val = {}

							if(Max) Val.Max = Max
							if(Min) Val.Min = Min
							if(Name) Val.Name = Name
							if(isCalculate && typeof isCalculate === 'boolean') Val.isCalculate = isCalculate
							if(Sensor && typeof Sensor === 'boolean') Val.Sensor = Sensor
							if(Alert && typeof Alert === 'boolean') Val.Alert = Alert
							if(date && ( !Variables[Name+'__c'] || !Variables[Name])) Val.CreateDate = date
							if(userRecord.displayName && ( !Variables[Name+'__c'] || !Variables[Name])) Val.CreateBy = userRecord.displayName
							if(userRecord.displayName) Val.ModifyBy = userRecord.displayName
							if(date) Val.ModifyDate = date
							if(isModify && typeof isModify === 'boolean') Val.isModify = isModify

							if (Formula) {
								var setupFormula = Formula.replace(/Prev[(]/g, '('),
								  	listFormulaVariables = Formula.replace(/Prev[(]/g, '').replace(/[+-/*()]/g, '').split('  '),
								  	isFormula = true;

								for(var i in listFormulaVariables ){
									var cloneVariable = listFormulaVariables[i];
									//Si la variable no existe actualizar la formula como invalida
									if (!Variables[cloneVariable]) {
										isFormula = false
									}
								}

								if (!isFormula) {
									return res.status(404).json({
										code: "Formula_Invalid",
										status: 404,
										message: 'La formula '+Formula+' no es valida',
										request: 'addVariable'
									})
								}else{
									Val.Formula = Formula
								}
							}
							var variable = {}
							if (Name.includes('__c')) {
								variable[Name] = Val	
							}else{
								variable[Name+'__c'] = Val	
							}
							val.update(variable, function (err) {
								var create = true
								if (Variables[Name+'__c'] || Variables[Name]) create = false
								if (!err) triggerVariable.afterInsert(data.cid, variable);
							})

							return res.status(201).json({
								code: "Variable_Created",
								status: 201,
								message: 'La variable '+Name+' se ha creado/actualizado exitosamente',
								name: Name.includes('__c') ? Name : Name + '__c',
								request: 'addVariable'
							})
						}

						res.status(404).json({
							code: "Variable_Existent",
							status: 404,
							message: 'La variable '+Name+' ya existe en el sistema',
							request: 'addVariable'
						})

					})

				}else{
					return res.status(401).json({
						code: "User_Unauthorized",
						status: 401,
						message: 'El usuario no esta autorizado para realizar esta acción',
						request: 'addCrop'
					})
				}
				
			}
			
			res.status(400).json({
				code: "Missing_Data",
				status: 400,
				message: 'El usuario le falta el cropid o no existe en la compañia',
				request: 'addLote'
			})
		})
		.catch(function(error) {
			console.log("Error fetching user data:", error);
			res.send('T.T');
		});



	}
}