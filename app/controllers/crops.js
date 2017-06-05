var fb = require('firebase-admin');
var moment = require('moment');

module.exports = {

	deleteCrop: (req, res) => {

		const {body, headers, protocol} = req,
		{cropid} = body;
		let auth = fb.auth(),
		database = fb.database();

		auth.getUser(headers.uid)
		.then(function(userRecord) {
			const {photoURL} = userRecord

			if (photoURL) {
				const data = JSON.parse(photoURL);
				
				if (data.profile === 'Admin' || data.profile === 'Register') {

					if (!cropid) {
						return res.status(400).json({
							code: "Missing_Data",
							status: 400,
							message: 'El campo cropid es requerido para eliminar un sensor',
							request: 'addLote'
						})
					}
					// console.log('Company/'+data.cid+'/Crops/'+cropid)
					let ref = database.ref('Company/'+data.cid+'/Crops/'+cropid)
					ref.remove()
					
					return res.status(200).json({
						code:"Success",
						status: 200,
						message: 'El lote a sido eliminada exitosamente'
					})

				}
			}

		})

	},

	addCrop: (req, res) => {
		const {body, headers, protocol} = req,
		{cropid, Name, StartDate, CropVariety, IrrigationType, FieldCapacity, Lara, isCalculate, Area} = body
		auth = fb.auth(),
		database = fb.database();
		var session = false;

		auth.getUser(headers.uid)
		.then(function(userRecord) {
			const {photoURL} = userRecord

			if (photoURL) {
				const data = JSON.parse(photoURL);
				
				if (data.profile === 'Admin' || data.profile === 'Register') {

					if (!cropid) {
						if (!Name || !StartDate) {
							return res.status(400).json({
								code: "Missing_Data",
								status: 400,
								message: 'El usuario le falta el campo Name o StartDate son campos requeridos',
								request: 'addCrop'
							})
						}

						if (StartDate.indexOf(moment(StartDate,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')) < 0){
							return res.status(400).json({
								code: "Bad_Data",
								status: 400,
								message: 'El usuario ingreso un StartDate invalido',
								request: 'addCrop'
							})
						}
					}

					let ref = database.ref('Company/'+data.cid+'/Crops'),
					date = moment().utc().format('YYYY-MM-DD HH:mm:ss');

					ref.once('value', function (val) {
							
							var obj = {}, status = 'actualizado';
							var key = ''

							if(typeof isCalculate === 'boolean') obj.isCalculate = isCalculate
							if(IrrigationType) obj.IrrigationType = IrrigationType
							if(CropVariety) obj.CropVariety = CropVariety
							if(StartDate) obj.StartDate = StartDate
							if(FieldCapacity) obj.FieldCapacity = isNaN(parseInt(FieldCapacity)) ? "" : parseInt(FieldCapacity)
							if(Name) obj.Name = Name
							if(Lara) obj.Lara = isNaN(parseInt(Lara)) ? "" : parseInt(Lara)
							if(Area) obj.Area = isNaN(parseInt(Area)) ? "" : parseInt(Area)

							if (isCalculate === true) {
								obj.Lara = ""
								obj.Area = ""
								obj.FieldCapacity = ""
							}
														
							if (cropid) {
								if (!val.val()[cropid]) return res.status(400).json({
									code: "Bad_Data",
									status: 400,
									message: 'El usuario ingreso un loteid invalido',
									request: 'addLote'
								})

								obj.ModifyBy = userRecord.displayName
								obj.ModifyDate = date
								key = cropid
								database.ref('Company/'+data.cid+'/Crops/'+cropid).update(obj, function (err) {
									if (err) console.log(err)

									response()
								})

							} else {
								
								obj.CreateBy = userRecord.displayName
								obj.CreateDate = date
								obj.ModifyBy = userRecord.displayName
								obj.ModifyDate = date

								// console.log(obj)
								// console.log(Lara)
								
								let insert = database.ref('Company/'+data.cid+'/Crops').push()
								insert.set(obj, function (err) {
									if (err) console.log(err)

									response()
								})
								key = insert.key
								status = 'creado'
							}

							function response() {
								return res.status(201).json({
									code: 'Crop_Created',
									status: 201,
									message: 'El cultivo '+Name+' se ha '+status+' exitosamente',
									url: protocol + '://' + headers.host + '/crops/'+ key	,
									id: key	
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
			
			// See the UserRecord reference doc for the contents of userRecord.
			// console.log("Successfully fetched user data:", userRecord.toJSON());
			// res.send('Ok');
		})
		.catch(function(error) {
			console.log("Error fetching user data:", error);
			res.send('T.T');
		});

	},
	removeCrop: (req, res) => {},
	updateCrop: (req, res) => {},
	getCrop: (req, res) => {},
	getCropsByName: (req, res) => {},

	setSensor: function (req, res) {

		var body = req.body,
			db = fb.database(),
			ref = db.ref("Sensors/"+body.serial);

		ref.once("value").then(function(snapshot){

			if (snapshot.val() === null) {
				return res.status(404).json({
					status: 404,
					code: 'NotFoundSensor',
					message: '¡Lo sentimos! El sensor no existe en el store. Por favor intente con otro sensor o añada este al store'
				})
			}

			var c = snapshot.val().Company

			if (c) {

				var cRef = db.ref("Company/"+c+"/Sensors/"+body.serial)

				cRef.once('value', function(sensorInfo){
					if (sensorInfo.val() === null) {
						return res.status(404).json({
							status: 404,
							code: 'NotFoundSensorInfo',
							message: '¡Lo sentimos! El sensor no tiene informacion existe en el store. Por favor intente con otro sensor o añada informacion a este'
						})
					}

					if (sensorInfo.val().Status === 'disabled') {
						cRef.update({Status:'active'})
					}

					if (!sensorInfo.val().Crop || !sensorInfo.val().Lote || !sensorInfo.val().Variable) {
						return res.status(400).json({
							status:400,
							code:'BadRequestInfoMissing',
							message: '¡Lo sentimos! El sensor no tiene toda la informacion requerida para hacer actualizaciones. Por favor completar: cultivo id, varialbe, lote id'
						})
					}
					var vRef = db.ref("Company/"+c+"/Crops/"+sensorInfo.val().Crop+"/Lotes/"+sensorInfo.val().Lote+"/Variables/"+sensorInfo.val().Variable)

					vRef.once('value', function (variableInfo) {

						// console.log(variableInfo.val())
						if (variableInfo.val() == null) {
							return res.status(404).json({
								status: 404,
								code: 'NotFoundVariableInfo',
								message: '¡Lo sentimos! La variable no tiene informacion existe en el store. Por favor intente con otro lote o cree la variable a este'
							})
						}

						var date = body.date.split(' ')[0]
						var o = {}
						var c_Alert = ''
						var c_Values = 0

						if (variableInfo.val().Values[date]) {
							
							c_Values = variableInfo.val().Values[date].Values
							c_Values[body.date] = parseInt(body.value)

							var c_Average = (variableInfo.val().Values[date].Average + parseInt(body.value)) / 2
								
							if (c_Average > variableInfo.val().Max) c_Alert = 'Valor mayor al maximo'
							if (c_Average < variableInfo.val().Min) c_Alert = 'Valor menor al minimo'

							o[date] = {
								Alert: c_Alert,
								Values: c_Values,
								Average: c_Average
							}
							
						} else {
							c_Values = parseInt(body.value)
							if (c_Values > variableInfo.val().Max) c_Alert = 'Valor mayor al maximo'
							if (c_Values < variableInfo.val().Min) c_Alert = 'Valor menor al minimo'
							
							o[date] = {
								Alert: c_Alert,
								Average: c_Values
							}
							o[date].Values[body.date] = parseInt(c_Values)
						}

						vRef.update(o)

						res.status(200).json({
							status: 200,
							code: 'UpdateVariable',
							message: 'La variable '+sensorInfo.val().Variable+' a sido actualizada'
						})

					})

				})

			}

		}).catch(function (err) {
			console.log('error: ', err)
			res.status(400).json({
				status: 400,
				code: 'BadRequest',
				message: 'Es un error no explorado: '+err
			})
		});
		
	}


}