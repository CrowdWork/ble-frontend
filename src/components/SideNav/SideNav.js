import './SideNav.css'
import React, { Fragment } from 'react'
import { Link, NavLink } from 'react-router-dom'
import M from 'materialize-css'


const SideNav = ({ firstName, lastName, email, isLoggedIn, onLogout }) => {
  const sidenav = document.querySelectorAll('.sidenav')
  M.Sidenav.init(sidenav, {
    draggable: true,
    preventScrolling: true
  })
  
  return (
    <Fragment>
    
      <ul id="mobile" className="sidenav">
          <li>
            <div className="user-view">
            <div className="background">
              <img src="https://i.imgur.com/5ui8Nqnm.jpg" alt='abstract background img'/>
            </div>
            {isLoggedIn && ( 
              <Fragment>
                <span className="white-text name">{firstName} {lastName}</span>
                <span className="white-text email">{email}</span>
              </Fragment>
              )
            }
            </div>
          </li>
          <li><div className="subheader">Account</div></li>
          {isLoggedIn ? (
            <li><Link to="/">Account <i className="material-icons">dashboard</i></Link></li>
          ) : (
            <Fragment>
              <li><Link to="/signup">Guest <i className="material-icons">account_circle</i></Link></li>
            </Fragment>
          )}
          
          {isLoggedIn && (
            <li><Link to="/" onClick={onLogout}>Logout<i className="material-icons">power_settings_new</i></Link></li>
          )}
          <li><div className="divider"></div></li>
          <li><div className="subheader">Services</div></li>
          <li className="no-padding">
            <Link to="/legal-index">Legal Index<i className="material-icons">search</i></Link>
          </li>
          <li className="no-padding">
            <Link to="/frankinsense">Frankensense Classroom<i className="material-icons">school</i></Link>
          </li>
          <li className="no-padding">
            <Link to="/court-finder">Court Finder <i className="material-icons">map</i></Link>
          </li>
          <li className="no-padding">
            <Link to="/practical-practice">Practical Practice<i className="material-icons">work</i></Link>
          </li>
        </ul>
        
        {isLoggedIn ? (
          <ul id='desktop' className="sidenav hide-on-med-and-down z-depth-0">
          <li>
            <div className="user-view">
            <div className="background">
              <img src="https://i.imgur.com/5ui8Nqnm.jpg" alt='abstract background img'/>
            </div>
            {isLoggedIn && (
              <Fragment>
                <span className="white-text name">{firstName} {lastName}</span>
                <span className="white-text email">{email}</span>
              </Fragment>
            )}
            </div>
          </li>
          <li><div className="subheader">Account</div></li>
          {isLoggedIn ? (
            <li><NavLink to="/">Account <i className="material-icons" activeclassname="selectedLink">dashboard</i></NavLink></li>
          ) : (
            <Fragment>
              <li><Link to="/signup">Guest <i className="material-icons">account_circle</i></Link></li>
            </Fragment>
          )}
          
          {isLoggedIn && (
            <li>
              <Link to="/login" onClick={onLogout}>
                Logout
                <i className="material-icons">power_settings_new</i>
              </Link>
            </li>
          )}
          <li><div className="divider"></div></li>
          <li><div className="subheader">Services</div></li>
          <li className="no-padding">
            <Link to="/legal-index">Legal Index<i className="material-icons">search</i></Link>
          </li>
          <li className="no-padding">
            <Link to="/frankinsense">Classroom<i className="material-icons">school</i></Link>
          </li>
          <li className="no-padding">
            <Link to="/court-finder">Court Finder <i className="material-icons">map</i></Link>
          </li>
          <li className="no-padding">
            <Link to="/practical-practice">Practical Practice<i className="material-icons">work</i></Link>
          </li>
        </ul>
        ) : (null)}
        
    </Fragment>
    
  )
}

export default SideNav