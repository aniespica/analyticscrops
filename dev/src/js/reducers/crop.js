export default function crop(state={
	Crop: {},
	Crops: [],
	Lote: {},
	Variables:[],
	Sensors: [],
	Vars: {},
	Fetching: false,
	Error: null
}, action) {

	switch(action.type) {

		case "CREATE_CROP_REJECTED": {
			state.Error = action.payload
			var message = 'Hubo un error, por favor intente de nuevo'
			if (action.payload.data && action.payload.data.message) {
				message = action.payload.data.message
			}
			document.getElementById('spinner').style.display = "none"
			$.notify(message, "error");
			return {...state}
		}

		case "CREATE_CROP_FULLFILED": {
			if (typeof action.payload === 'object' && action.payload.id) {
				state.Fetching = action.payload.id
			}else{
				state.Fetching = action.payload
			}

			console.log(state.Fetching)
			
			return {...state}
		}

		case "READ_CROP_FULLFILED": {

			state.Crop = action.payload
			return {...state, Fetching:false, Error: action.payload}
		}

		case "READ_CROPS_REJECTED": {
			return {...state, Fetching:false, Error: action.payload}
		}

		case "READ_CROPS_FULLFILED": {
			var crops = []
			if (Array.isArray(action.payload)) {
				state.Crops = action.payload
			}else{
				state.Crops.push(action.payload)
			} 

			return {...state}
		}

		case "READ_LOTE_FULLFILED":{
			state.Lote = action.payload
			return {...state}
		}

		case "READ_VARIABLES_FULLFILED":{

			var vars = Object.keys(action.payload),
			variable = []

			for(var i in vars){
				var _var = action.payload[vars[i]]
				if (!_var) continue
				_var.Id = vars[i]
				variable.push(_var);
			}

			state.Variables = variable
			return {...state}
		}

		case "READ_VARS_FULLFILED":{
			state.Vars = action.payload
			return {...state}
		}

		case "CREATE_SENSOR_FULLFILED":{

			state.Fetching = action.payload

			return {...state}
		}

		case "READ_SENSORS_FULLFILED": {
			var vars = Object.keys(action.payload),
			sensors = []

			for(var i in vars){
				var _var = action.payload[vars[i]]
				if (!_var) continue
				_var.Id = vars[i]
				sensors.push(_var);
			}

			state.Sensors = sensors
			return {...state}
		}

		case "DELETED": {
			return {...state}
		}


	}

	return state
}