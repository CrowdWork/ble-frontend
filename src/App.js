import './App.css'
import React, { Component } from 'react'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import decode from 'jwt-decode'
import axios from 'axios'
import Navigation from './components/Navigation/Navigation'
import Signup from './components/Signup/Signup'
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import LegalIndex from './components/LegalIndex/LegalIndex'
import Admin from './components/Admin/Admin'
import CaseDetail from './components/CaseDetail/CaseDetail'


const url = "http://localhost:4000"
// const url = "https://ble-backend.herokuapp.com"

const authHeader = {
  headers: {
  'Authorization': localStorage.token
}}

class App extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    isLoggedIn: false,
    signupError: null,
    loginError: null,
    userID: null,
    searchResult: null,
    errorMessage: ''
  }

  async componentDidMount() {
    if (localStorage.token) {
      this.setState({
        isLoggedIn: true,
        userID: decode(localStorage.token)
      })
      try {
        const user = await axios.get(`${url}/users/me`, authHeader)
        this.setState({
          firstName: user.data.firstName,
          lastName: user.data.lastName,
          email: user.data.email
        })
      } catch (err) {
        console.log('ERROR:', err)
      }
      
    } else {
      this.setState({
        isLoggedIn: false,
        userID: null
      })
    }
  }

  onSignupSumbit = async (userInfo) => {
    try {

      const newUser = await axios.post(`${url}/users`, {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        password: userInfo.password
      })

      localStorage.token = newUser.data.token

      this.setState({
        firstName: newUser.data.user.firstName,
        lastName: newUser.data.user.lastName,
        email: newUser.data.user.email,
        isLoggedIn: true,
        userID: decode(localStorage.token)
      })

      this.props.history.push('/')
    } catch (err) {
        console.log(err)
        this.setState({
          signupError: err
        })
    } 
  }

  onLoginSubmit = async (credentials) => {
    try {
      const loginUser = await axios.post(`${url}/users/login`, {
        email: credentials.email,
        password: credentials.password
      })

      localStorage.token = loginUser.data.token

      this.setState({
        firstName: loginUser.data.user.firstName,
        lastName: loginUser.data.user.lastName,
        email: loginUser.data.user.email,
        isLoggedIn: true
      })
      
      this.props.history.push('/')
    } catch (err) {
      this.setState({
        loginError: err
      })
    }
  }

  onLogout = () => {
    this.setState({
      email: '',
      password: '',
      isLoggedIn: false,
      userID: null
    })

    localStorage.clear()
  }

  onSearchSubmit = async (searchBody) => {
    for (let searchTerm in searchBody) {
      if (!searchBody[searchTerm]) {
        searchBody[searchTerm] = ''
      }
    }
    console.log(searchBody)
    
    try {
      const searchResult = await axios.get(`${url}/cases/search?query=${JSON.stringify(searchBody)}`, authHeader)
      console.log(searchResult)
      this.setState({ searchResult: searchResult.data })
    } catch (err) {
        this.setState( {errorMessage: err.message })
    }
  }

  render() {
    return (
      <div className="App-container">
        <Navigation
          firstName={this.state.firstName}
          lastName={this.state.lastName}
          email={this.state.email} 
          isLoggedIn={this.state.isLoggedIn}
          onLogout={this.onLogout}
        />
        <main>
          <Switch>
            <Route 
              exact path="/"
              render={(props) => this.state.isLoggedIn ? (
                <Home 
                  {...props}
                  firstName={this.state.firstName}
                  lastName={this.state.lastName}
                  email={this.state.email}
                  isLoggedIn={this.state.isLoggedIn}
                  handleLogout={this.handleLogout}
                />
              ) : (
                <Redirect to="/login" />
              )
              }
            />
            <Route path="/admin" 
              render={(props) => (
                <Admin
                  {...props}
                />
              )}
            />
            <Route path="/signup"
              render={(props) => (
                <Signup 
                  {...props} 
                  onSubmit={this.onSignupSumbit}
                />
              )}
            />
            <Route path="/login"
              render={(props) => this.state.isLoggedIn ? (
                <Redirect to="/" />
              ) : (
                <Login 
                  {...props}
                  onSubmit={this.onLoginSubmit}
                />
              )
              }
            />
            <Route path="/legal-index"
              render={(props) => (
                <LegalIndex
                  {...props}
                  onSubmit={this.onSearchSubmit}
                  searchResult={this.state.searchResult}
                />
              )}
            />
            <Route path="/:mongo_id"
              render={(props) => (
                <CaseDetail
                  {...props}
                />
              )} />
          </Switch>
        </main>
      </div>
    )
  }
}

export default withRouter(App)
