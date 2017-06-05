import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux"
import { Router, Route, IndexRoute, browserHistory} from 'react-router';
import utils from './actions/utils'

import Layout from './pages/Layout'
import Home from './pages/Home'
import ListView from './pages/ListView'
import Crops from './pages/Crops'
import Variables from './pages/Variables'
import Vars from './pages/Vars'
import Sensores from './pages/Sensores'
import Users from './pages/Users'
import Crop from './pages/Crop'
import Lote from './pages/Lote'
import Login from './pages/Login'
import store from "./store"

const app = document.getElementById('app')

ReactDOM.render(
	<Provider store={store}>
		<Router history={browserHistory} >
			<Route path='signin' component={Login}></Route>
			<Route path='signup' component={Login}></Route>
			<Route path='/' component={Layout}>
				<IndexRoute component={Home}></IndexRoute>
				<Route path="usuarios" component={Users}></Route>	
				<Route path="perfil" component={Home}></Route>	
				<Route path="variables" component={Variables}></Route>	
				<Route path="sensores" component={Sensores}></Route>	
				<Route path="cultivos">
					<IndexRoute component={Crops}></IndexRoute>
					<Route path=":crop">
						<IndexRoute component={Crop}></IndexRoute>
						<Route path=":lote">
							<IndexRoute component={Lote}></IndexRoute>
							<Route path=":vars">
								<IndexRoute component={Vars}></IndexRoute>
							</Route>
						</Route>
					</Route>
				</Route>
				<Route path="/crear/cultivo" component={Home}></Route>	
				<Route path="/crear/variable" component={Home}></Route>	
				<Route path="/crear/sensor" component={Home}></Route>	
			</Route>
		</Router>
	</Provider>
, app)