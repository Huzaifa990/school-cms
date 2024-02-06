import React, { useEffect } from 'react'
import logo from "../images/logo.png";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

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



  var navLinks = "";

  useEffect(()=>{
    navLinks = document.getElementById("navLinks");
  }, [])

  function showMenu(){
      navLinks.style.right = "0";
  }

  function hideMenu(){
      navLinks.style.right = "-200px";
      
  }
  return (
    <div>
      <nav>
            <Link to="/">
                <img src={logo} alt="logo" className='nav-logo'/>
            </Link>
            <div className="nav-links" id="navLinks">
                <FontAwesomeIcon icon={faXmark} className="fa-solid fa-xmark" onClick={hideMenu} />
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
            <FontAwesomeIcon className="fa-solid fa-bars" icon={faBars} onClick={showMenu} />

        </nav>
    </div>
  )
}
