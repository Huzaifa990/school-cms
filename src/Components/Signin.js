import React from "react";
import banner from "../images/logo.png";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import axios from "axios";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";
import data from "../Config/config";
import API from "../Config/config";

import { useNavigate } from "react-router-dom";

export default function Signin() {
  var navigate = useNavigate();

  function signin(e) {
    e.preventDefault();

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    var payload = {
      email: email,
      password: password,
    };

    axios
      .post(`${API.apiUri}/signin`, payload)
      .then((res) => {
        console.log(res);
        NotificationManager.success("Login Successful!");

        localStorage.setItem("cms-login", true);
        localStorage.setItem("cms-userName", CryptoJS.AES.encrypt(res.data.firstName, data.secretKey));
        localStorage.setItem("cms-status", CryptoJS.AES.encrypt(res.data.status, data.secretKey));
        localStorage.setItem("user-id", CryptoJS.AES.encrypt(res.data._id, data.secretKey));
        localStorage.setItem("cms-accountType", CryptoJS.AES.encrypt(res.data.accountType, data.secretKey));
        localStorage.setItem("cms-adminAccountStatus", CryptoJS.AES.encrypt(res.data.adminStatus, data.secretKey));
        
        if(!res.data.teacherStatus){
          navigate("/inactive")
        }
        else if(res.data.status === "incomplete" && res.data.accountType === "teacher"){
          navigate("/teacherinfo");
        }
        else if((res.data.accountType === "admin" && res.data.adminStatus === "approved") || res.data.accountType === "superadmin"){
          navigate("/adminPanel");
        }
        else if(res.data.status === "complete" && res.data.accountType === "teacher"){
          navigate("/teacherdashboard");
        }
        else if((res.data.accountType === "admin" && res.data.adminStatus === "pending")){
          navigate("/pending");
        }
        else if((res.data.accountType === "admin" && res.data.adminStatus === "rejected")){
          navigate("/rejected");
        }
        else{
          alert("Account not approved!");
        }
      })
      .catch((e) => {
        NotificationManager.error(e.response.data);
        console.error(e);
      });
  }

  function goToHome(){
    navigate("/");
  }

  return (
    <div>
      <NotificationContainer />
      <div className="wrapper">
        <div className="inner signin-inner">
          <div className="image-holder">
            <img src={banner} alt="banner" className='signin-logo'/>
          </div>
          <form action="" onSubmit={signin}>
            <h3 className="signin-heading" style={{ fontSize: "40px"}}>
              Sign in
            </h3>

            <div className="form-wrapper">
              <input
                type="text"
                placeholder="Email Address"
                className="form-control"
                id="email"
              />
              <i className="zmdi zmdi-email"></i>
            </div>

            <div className="form-wrapper">
              <input
                type="password"
                placeholder="Password"
                className="form-control"
                id="password"
              />
              <i className="zmdi zmdi-lock"></i>
            </div>
            <div className="btn-container">
              <button type="submit">
                Login
                <i className="zmdi zmdi-arrow-right"></i>
              </button>
              <button type="button" onClick={goToHome}>Cancel</button>
            </div>
            <br />
            <center>
              <Link to="/signup" className="btm-link">
                {" "}
                Create an account{" "}
              </Link>
            </center>
          </form>
        </div>
      </div>
    </div>
  );
}
