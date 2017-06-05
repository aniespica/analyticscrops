if (localStorage.User) {}

export default function crop(state={
	Crop: {},
	Users: [],
	User: localStorage.User ? JSON.parse(localStorage.User) : {},
	Profiles: localStorage.Profiles ? JSON.parse(localStorage.Profiles) : [],
	Fetching: false,
	Error: null
}, action) {

	switch(action.type) {

		case "READ_CROPS_FULLFILED": {
			var users = []
			if (Array.isArray(action.payload)) {
				users = action.payload
			} 
			return {...state, Users:users, Crop:{}}
		}

		case "FETCH_ACCOUNT_FULFILLED": {
			state.Fetching = true
			state.User = action.payload
			state.Error = false
			return {...state}
		}

		case "CREATE_ACCOUNT_FULFILLED": {
			state.Fetching = action.payload
			state.Error = false
			return {...state}
		}

		case "FETCH_PROFILES_FULFILLED": {
			return {...state, Profiles:action.payload}
		}

		case "CREATE_ACCOUNT_REJECTED":{
			return {...state, Error: action.payload}
		}

		case "LOGOUT_ACCOUNT_FULFILLED": {
			state.Fetching = true
			state.User = null
			state.Error = false
			return {...state}
		}

	}

	return state
}