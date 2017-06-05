import { combineReducers } from "redux"

import crop from "./crop"
import user from "./user"

const rootReducer = combineReducers({
	crop,
	user
})

export default rootReducer