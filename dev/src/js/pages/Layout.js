import React, { PropTypes, Component } from 'react';
import { IndexLink, Link, browserHistory } from 'react-router';
import * as user from '../actions/users'
import { connect } from "react-redux"


//Components
import Menu from '../components/Menu'
import Headbar from '../components/Headbar'
import Spinner from '../components/Spinner'
import LoginForm from '../components/LoginForm'

@connect((store)=>{
  return {
    User: store.user.User
  }
})
export default class Layout extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {}
  }

  componentDidMount(){}

  componentDidUpdate() {
  }

  componentWillUnmount(){}

  componentWillMount(){
    if (localStorage["firebase:authUser:"+utils.apiKey+":[DEFAULT]"]) {
      this.props.dispatch(user.fetchAccount())
    }else{
      this.context.router.push('/signin')
      //this.props.dispatch(user.login({Email: 'aniespica@gmail.com', Password: 'Veevart123'}))
    }
  }

  render() {

    return (
      <div id='body-container'>
        <Menu/>
        <Headbar/>
        <div id='body-content'>
          {this.props.children}
        </div>
        <div id='backgroundForm'></div>
        <Spinner display={localStorage.User ? true : false}/>
      </div> 
    );
  }

}
