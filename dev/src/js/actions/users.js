export function createUser(u) {
	return dispatch => {
		utils.auth.createUserWithEmailAndPassword(u.Email, u.Password).then(function(user) {
	   	const ref = utils.db.ref('Company')
	   	let refC = utils.db.ref('Company').push()
	   	const photoURL = { cid: refC.push().key, profile: 'Admin' }
	   	const Name = u.FirstName ? u.FirstName +' '+ u.LastName : u.LastName;
	   	user.updateProfile({displayName: Name, photoURL: JSON.stringify(photoURL)}).then(function(){
				
				const v = utils.variables
				const p = utils.profileNames
				var o = {
					Name: u.Company.toLowerCase(),
					Variables: v.default,
					ProfileNames: p.default,
					Users: {}
				}
				o.Users[user.uid] = {
					Email: u.Email, 
					FirstName: u.FirstName,
					LastName: u.LastName,
					Profile: photoURL.profile, 
					Name: Name,
					Phone: u.Phone,
					Title: u.Title,
					CreatedBy: Name,
					CreateDate: utils.moment().format('YYYY/MM/DD HH:mm'),
					ModifiedBy: Name,
					ModifyDate: utils.moment().format('YYYY/MM/DD HH:mm'),
					Notification:{}	
				}

				ref.once('value', function(snapshot){
					const _cKeys = Object.keys(snapshot.val())
					const _c = snapshot.val()
					for (var i = _cKeys.length - 1; i >= 0; i--) {
						if (_c[_cKeys[i]].Name == o.Name) {

							user.delete().then(function() {
								 return dispatch({
									type: "CREATE_ACCOUNT_REJECTED",
									payload: 'La compañia ya existe en nuestro sistema'
								})
							});
							
						}
					}
					

					user.sendEmailVerification().then(function() {

						refC.set(o)
						return dispatch({
							type: 'CREATE_ACCOUNT_FULFILLED',
							payload:'Revisa tu email para validar el usuario'
						})
					})
				})
					
			})   	
	   })
		.catch(function(error) {
			console.log(error)
			dispatch({
				type: "CREATE_ACCOUNT_REJECTED",
				payload: error
			})
		});
	}
}

export function fetchAccount(){
	return dispatch => {

		utils.auth.onAuthStateChanged(function(user) {
			if (user) {
				const userJSON = JSON.parse(user.photoURL);
				utils.db.ref('Company/'+userJSON.cid+'/Users/'+user.uid).on('value', function (snapshot) {
					var u = snapshot.val()
					u.cid = userJSON.cid
					u.Id = user.uid
					localStorage.User = JSON.stringify(u)
					getProfile(dispatch, u)
					dispatch({
						type: 'FETCH_ACCOUNT_FULFILLED',
						payload: u
					})
				})
			}
		});
	}
}

export function login(u) {
	// utils.auth.sendPasswordResetEmail(u.Email).then(function() {
 //      // Password reset confirmation sent. Ask user to check their email.
 //    })
	return dispatch => {
		utils.auth.signInWithEmailAndPassword(u.Email, u.Password).then(function (user) {
			const userJSON = JSON.parse(user.photoURL);
			console.log(userJSON)
			utils.db.ref('Company/'+userJSON.cid+'/Users/'+user.uid).on('value', function (snapshot) {
				var u = snapshot.val()
				u.cid = userJSON.cid
				u.Id = user.uid
				localStorage.User = JSON.stringify(u)
				getProfile(dispatch, u)
				dispatch({
					type: 'FETCH_ACCOUNT_FULFILLED',
					payload: u
				})
			})
		})
		.catch(function(error){
			console.log(error)
			dispatch({
				type: 'FETCH_ACCOUNT_REJECTED',
				payload: error
			})
		})
	}
}

export function logout(u){
	return dispatch => {
		utils.auth.signOut().then(function() {
		 	dispatch({
				type: 'LOGOUT_ACCOUNT_FULFILLED',
				payload: 'Logout success'
			})
		}).catch(function(error) {
			dispatch({
				type: 'LOGOUT_ACCOUNT_REJECTED',
				payload: error
			})
		});
	}
}

export function readUsers(user) {
	return dispatch => {
		utils.db.ref('Company/' + user.cid + '/Users').once('value', function(snapshot) {
			var c = {}
			var crops = []
			snapshot.forEach(function(childSnapshot) {
				c = childSnapshot.val()
				c.Id = childSnapshot.key
				crops.push(c)
			});

			return dispatch({
				type: "READ_CROPS_FULLFILED",
				payload: crops
			}) 
		});
	}
}

export function updateUser(cUser, user){
	return dispatch => {
		if(!cUser.profile || cUser.profile == 'Visit'){
			return dispatch({
				type: "UPDATE_USER_REJECTED",
				payload: 'Usuario no autorizado'
			})
		}

		const ref = utils.db.ref('Company/' + cUser.cid + '/Users/' + user.Id + '/')

		ref.once('value', function (snapshot) {
			var _user = snapshot.val()
			if (!_user) {
				return dispatch({
					type: "UPDATE_USER_REJECTED",
					payload: 'Usuario no encontrado'
				})
			}

			var u = {
				Email: user.Email || _user.Email, 
				FirstName: user.FirstName || _user.FirstName,
				LastName: user.LastName || _user.LastName,
				Profile: cUser.profile == 'Admin' && user.Profile ? user.Profile : _user.Profile, 
				Name: Name || _user.Name,
				Phone: user.Phone || _user.Phone,
				Title: user.Title || _user.Title,
				ModifiedBy: Name,
				ModifyDate: utils.moment().format('YYYY/MM/DD HH:mm')
			} 

			ref.update(u)

			return dispatch({
					type: "UPDATE_USER_FULLFILED",
					payload: u
				})

		})
	
	}
}

export function update(user){
	return dispatch => {

		const ref = utils.db.ref('Company/' + user.cid + '/Users/' + user.Id + '/')

		ref.once('value', function (snapshot) {
			var _user = snapshot.val()
			if (!_user) {
				return dispatch({
					type: "UPDATE_USER_REJECTED",
					payload: 'Usuario no encontrado'
				})
			}

			var u = {
				Email: user.Email || _user.Email, 
				FirstName: user.FirstName || _user.FirstName,
				LastName: user.LastName || _user.LastName,
				Profile: user.profile == 'Admin' || !user.Founder ? user.Profile : _user.Profile, 
				Name: Name || _user.Name,
				Phone: user.Phone || _user.Phone,
				Title: user.Title || _user.Title,
				ModifiedBy: Name,
				ModifyDate: utils.moment().format('YYYY/MM/DD HH:mm')
			} 

			ref.update(u)

			return dispatch({
					type: "UPDATE_USER_FULLFILED",
					payload: u
				})

		})
	
	}
}

export function setUser(cUser, u){
	return dispatch => {
		if(!cUser.Profile || cUser.Profile == 'Visit'){
			return dispatch({
				type: "CREATE_ACCOUNT_REJECTED",
				payload: {message:'Usuario no autorizado'}
			})
		}

		utils.auth.createUserWithEmailAndPassword(u.Email, u.Password).then(function(user) {
	   	console.log(utils.auth.cUser)
	   	const photoURL = { cid: cUser.cid, profile: u.Profile }
	   	const Name = u.FirstName ? u.FirstName +' '+ u.LastName : u.LastName;
	   	user.updateProfile({displayName: Name, photoURL: JSON.stringify(photoURL)}).then(function(){
				console.log('Company/' + cUser.cid + '/Users/' + user.uid + '/')
				const ref = utils.db.ref('Company/' + cUser.cid + '/Users/' + user.uid + '/')
				var o = {
					Email: u.Email, 
					FirstName: u.FirstName,
					LastName: u.LastName,
					Profile: photoURL.profile, 
					Name: Name,
					Phone: u.Phone,
					Title: u.Title,
					CreatedBy: Name,
					CreateDate: utils.moment().format('YYYY/MM/DD HH:mm'),
					ModifiedBy: Name,
					ModifyDate: utils.moment().format('YYYY/MM/DD HH:mm'),
					Notification:{}	
				}

				user.sendEmailVerification().then(function() {
					console.log('here')
					ref.set(o)
					return dispatch({
						type: 'CREATE_ACCOUNT_FULFILLED',
						payload:'Revisa '+ u.Email +' para validar el usuario'
					})
				})
					
			})   	
	   })
		.catch(function(error) {
			console.log(error)
			dispatch({
				type: "CREATE_ACCOUNT_REJECTED",
				payload: error
			})
		});
	}
}

function getProfile(dispatch, user){

	utils.db.ref('Company/' + user.cid + '/ProfileNames/').once('value', function(snapshot){
		var profiles = []
		var p = {}
		snapshot.forEach(function(childSnapshot) {
			p = childSnapshot.val()
			p.Id = childSnapshot.key
			profiles.push(p)
		});
		localStorage.Profiles = JSON.stringify(profiles)

		return dispatch({
			type: 'FETCH_PROFILES_FULFILLED',
			payload: profiles
		})
	})

}