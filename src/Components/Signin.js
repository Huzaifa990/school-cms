import React from "react";
import banner from "../images/logo.png";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import axios from "axios";
import { Link } from "react-router-dom";

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
      .post("http://localhost:8080/signin", payload)
      .then((res) => {
        console.log(res);
        NotificationManager.success("Login Successful!");

        localStorage.setItem("cms-login", true);
        localStorage.setItem("cms-userName", res.data.firstName);
        localStorage.setItem("cms-status", res.data.status);
        localStorage.setItem("user-id", res.data._id);
        localStorage.setItem("cms-accountType", res.data.accountType);
        
        if(res.data.status === "incomplete" && res.data.accountType === "teacher"){
          navigate("/teacherinfo");
        }
        else if(res.data.accountType === "admin"){
          navigate("/adminPanel");
        }
        else{
          navigate("/teacherdashboard");
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
        <div className="inner">
          <div className="image-holder">
            <img src={banner} alt="banner" />
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
