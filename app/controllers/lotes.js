var fb = require('firebase-admin');
var moment = require('moment');
var triggerLote = require('./trigger-lote');
module.exports = {

	deleteLote: (req, res) => {

		const {body, headers, protocol} = req,
		{cropid, loteid} = body;
		let auth = fb.auth(),
		database = fb.database();

		auth.getUser(headers.uid)
		.then(function(userRecord) {
			const {photoURL} = userRecord

			if (photoURL) {
				const data = JSON.parse(photoURL);
				
				if (data.profile === 'Admin' || data.profile === 'Register') {

					if (!cropid || !loteid) {
						return res.status(400).json({
							code: "Missing_Data",
							status: 400,
							message: 'Los campos cropid y loteid son requerido para eliminar un sensor',
							request: 'addLote'
						})
					}

					let ref = database.ref('Company/'+data.cid+'/Crops/'+cropid+'/Lotes/'+loteid)
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

	addLote: (req, res) => {
		const {body, headers, protocol} = req,
		{Name, StartDate, FieldType, FieldCapacity, Lara, Area, cropid, loteid, initVal} = body;
		let auth = fb.auth(),
		database = fb.database();

		auth.getUser(headers.uid)
		.then(function(userRecord) {
			const {photoURL} = userRecord

			if (photoURL && cropid) {
				const data = JSON.parse(photoURL);
				
				if (data.profile === 'Admin' || data.profile === 'Register') {

					if (!loteid) {
						if (!Name || !StartDate) {
							return res.status(400).json({
								code: "Missing_Data",
								status: 400,
								message: 'El usuario le falta el campo Name o StartDate son campos requeridos',
								request: 'addLote'
							})
						}

						if (StartDate.indexOf(moment(StartDate,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')) < 0){
							return res.status(400).json({
								code: "Bad_Data",
								status: 400,
								message: 'El usuario ingreso un StartDate invalido',
								request: 'addLote'
							})
						}
					}
					
					let ref = database.ref('Company/'+data.cid+'/Crops/'+cropid+'/Lotes'),
					val = database.ref('Company/'+data.cid+'/Variables'),
					date = moment().utc().format('YYYY-MM-DD HH:mm:ss');
					var Variables = {}
					return val.once('value', function(snapshot){
						snapshot.forEach(function (childSnapshot) {



							Variables[childSnapshot.key] = {
								Max: childSnapshot.val().Max,
								Min: childSnapshot.val().Min,
								Name: childSnapshot.val().Name,
								Values: {}
							}

							if (childSnapshot.key === "SoilMoisture" && initVal) {
								lastDate = moment(StartDate).utc().add(-1, 'day').format('YYYY-MM-DD')
								Variables[childSnapshot.key].Values[lastDate] = {
									Average: parseFloat(initVal)
								}

								console.log(Variables[childSnapshot.key])
								console.log(Variables[childSnapshot.key].Values)

							}

							if (childSnapshot.val().Formula) {
								Variables[childSnapshot.key].Formula = childSnapshot.val().Formula
							}
							if (childSnapshot.val().isModify === true || childSnapshot.val().isModify === false) {
								Variables[childSnapshot.key].isModify = childSnapshot.val().isModify
							}
							if (childSnapshot.val().Sensor === true || childSnapshot.val().Sensor === false) {
								Variables[childSnapshot.key].Sensor = childSnapshot.val().Sensor
							}
						})

						ref.once('value', function (val) {
							
							var obj = {}
							var key = ''

							if(StartDate) obj.StartDate = StartDate
							if(FieldCapacity) obj.FieldCapacity = isNaN(parseInt(FieldCapacity)) ? 0 : parseInt(FieldCapacity)
							if(Name) obj.Name = Name
							if(Lara) obj.Lara = isNaN(parseInt(Lara)) ? 0 : parseInt(Lara)
							if(FieldType) obj.FieldType = FieldType
							if(Area) obj.Area = isNaN(parseInt(Area)) ? 0 : parseInt(Area)
							if(cropid) obj.ParentId = cropid
														
							if (loteid) {
								if (!val.val()[loteid]) return res.status(400).json({
									code: "Bad_Data",
									status: 400,
									message: 'El usuario ingreso un loteid invalido',
									request: 'addLote'
								})

								obj.ModifyBy = userRecord.displayName
								obj.ModifyDate = date
								key = loteid
								database.ref('Company/'+data.cid+'/Crops/'+cropid+'/Lotes/'+loteid).update(obj, function (err) {
									if (!err) triggerLote.afterInsert(data.cid, cropid)
								})

							} else {
								if(Variables) obj.Variables = Variables
								obj.CreateBy = userRecord.displayName
								obj.CreateDate = date
								obj.ModifyBy = userRecord.displayName
								obj.ModifyDate = date
								
								let insert = database.ref('Company/'+data.cid+'/Crops/'+cropid+'/Lotes').push()
								insert.set(obj, function (err) {
									if (!err) triggerLote.afterInsert(data.cid, cropid)
								})
								key = insert.key
							}

							return res.status(201).json({
								code: 'Lote_Created',
								status: 201,
								message: 'El lote '+Name+' se ha creado exitosamente',
								url: protocol + '://' + headers.host + '/crops/'+ cropid + '/lotes/' + key,
								id: key
							})

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
			
			// See the UserRecord reference doc for the contents of userRecord.
			console.log("Successfully fetched user data:", userRecord.toJSON());
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