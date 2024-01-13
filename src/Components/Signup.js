import React from 'react'
import banner from "../images/logo.png";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
	NotificationContainer,
	NotificationManager,
  } from "react-notifications";
  import "react-notifications/lib/notifications.css";
  import API from "../Config/config";

export default function Signup() {

	var navigate = useNavigate();

	function signUp(e){

		e.preventDefault();

		var firstName = document.getElementById('firstName').value;
		var lastName = document.getElementById('lastName').value;
		var email = document.getElementById('email').value;
		var password = document.getElementById('password').value;
		var confirmPassword = document.getElementById('confirmPassword').value;
		var account = document.getElementById("accountType");

		var accountType = account[account.selectedIndex].value;

		var payload = {
			firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
			accountType
		}

		if(password!== confirmPassword){
			NotificationManager.error("Passwords do not match!");
			document.getElementById('password').style.borderBottom = "2px solid crimson";
			document.getElementById('confirmPassword').style.borderBottom = "2px solid crimson";
		}
		else{
			axios.post(`${API.apiUri}/signup`, payload).then(()=>{
				NotificationManager.success("Signup Successful!");
				navigate("/signin");
			}).catch((e)=>{
				NotificationManager.error(e.response.data);
				console.error(e);
			})
		}
	}

	
	function goToHome(){
		navigate("/");
	  }
	


  return (
    <div>
		<NotificationContainer/>
      <div className="wrapper">
			<div className="inner">
				<div className="image-holder">
					<img src={banner} alt="banner"/>
				</div>
				<form action="" onSubmit={signUp}>
					<h3>Registration Form</h3>
					<div className="form-group">
						<input type="text" placeholder="First Name" className="form-control" id="firstName"/>
						<input type="text" placeholder="Last Name" className="form-control" id='lastName'/>
					</div>
					<div className="form-wrapper">
						<input type="text" placeholder="Email Address" className="form-control" id='email'/>
						<i className="zmdi zmdi-email"></i>
					</div>
					
					<div className="form-wrapper">
						<input type="password" placeholder="Password" className="form-control" id='password'/>
						<i className="zmdi zmdi-lock"></i>
					</div>
					<div className="form-wrapper">
						<input type="password" placeholder="Confirm Password" className="form-control" id='confirmPassword'/>
						<i className="zmdi zmdi-lock"></i>
					</div>

					<div className='form-wrapper'>
                        <label>Account Type: </label>
						<br/> 
                        <select name='floors' id='accountType'>
                            <option value="teacher"> Teacher </option>
                            <option value="admin"> Admin </option>     
                        </select>
                    </div>

					<div className='btn-container'>
						<button type='submit'>Register
							<i className="zmdi zmdi-arrow-right"></i>
						</button>
						<button type="button" onClick={goToHome}>Cancel</button>
					</div>
					
					<br/>
					<center>
					<Link to="/signin" className='btm-link'> Already have an account? </Link>
					</center>
				</form>
			</div>
		</div>
    </div>
  )
}
