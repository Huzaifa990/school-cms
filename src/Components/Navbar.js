import React from 'react'
import logo from "../images/logo.png";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {

  var loginStatus = JSON.parse(localStorage.getItem("cms-login"));

  var navigate = useNavigate();

  function logout(){
    localStorage.removeItem("cms-login");
    localStorage.removeItem("cms-userName");
    localStorage.removeItem("cms-status");
    localStorage.removeItem("user-id");
    localStorage.removeItem("cms-accountType");
    localStorage.removeItem("cms-adminAccountStatus");

    navigate("/");
  }

  return (
    <div>
      <nav>
            <Link to="/">
                <img src={logo} alt="logo"/>
            </Link>
            <div className="nav-links" id="navLinks">
                <i className="fa-solid fa-xmark" onclick="hideMenu()"></i>
                <ul>
                    <li> <Link to="/" className='links'>HOME</Link> </li>
                    
                    {loginStatus !== true?
                    <>
                      <li> <Link to="/signup" className='links'>SIGNUP/LOGIN</Link> </li>
                    </>:
                    <>
                      <li>
                        <button className='logout' onClick={logout}>Logout</button>
                      </li>
                    </>}
                    
                </ul>
            </div>
            <i className="fa-solid fa-bars"></i>
        </nav>
    </div>
  )
}
