import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	NotificationContainer,
	NotificationManager,
  } from "react-notifications";
  import "react-notifications/lib/notifications.css";
  import API from "../Config/config";

export default function Shuffling() {
  var location = useLocation();
  var teacherId = location.state.teacherId;
  var [teachers, setTeachers] = useState([]);
  var navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      var response = await fetch(`${API.apiUri}/teachers`);
      var data = await response.json();
      setTeachers(data);
      console.log(data);
    }

    getData();
  }, []);

  function handleClick(name, status) {
    var inputs = document.getElementsByClassName(name);
    if (status === true) {
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].disabled === false) {
          inputs[i].checked = true;
        }
      }
    } else {
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].checked = false;
      }
    }
  }

  function shuffleStudent(){


      var teachers = document.getElementsByClassName("chkTeacher");

      var availableTeacherIds = [];

      for(var i = 0; i < teachers.length; i++){
        if(teachers[i].checked === true && teachers[i].value !== "all"){
          availableTeacherIds.push(teachers[i].value);
        }
      }

      var payload = {
        availableTeachers: availableTeacherIds,
        absentTeacherId: teacherId
      }

      axios.post(`${API.apiUri}/shuffle`, payload).then(()=>{
        NotificationManager.success("Students Shuffled Successfully!");
        axios.put(`${API.apiUri}/teacherinfo/`+teacherId, {absentStatus: true}).then((res)=>{
          console.log(res);
          
          setTimeout(()=>{
            navigate("/adminPanel");
          }, 2000);

        }).catch((e)=>{
          console.log(e);
        });

      }).catch((e)=>{
        NotificationManager.error("Something went wrong!");
        console.log(e);
      })

  }
  return (
    <div className="shuffle_container">
      <NotificationContainer/>
      
      <div className="teacher_container">
        <div className="floor_a">
          <h2>Floor A</h2>
          <span className="inp_container">
            <input
              type="checkbox"
              className="chkTeacher"
              value="all"
              name="a"
              onChange={(e) => handleClick(e.target.name, e.target.checked)}
            />{" "}
            Select All{" "}
          </span>
          <hr />
          <br />

          {teachers.map((item) => {
            if (item.floorName === "a") {
              return (
                <div className="teachers">
                  <span className="inp_container">
                    <input
                      disabled={item._id === teacherId ? true : false}
                      type="checkbox"
                      className="chkTeacher a"
                      value={item._id}
                    />{" "}
                    {item.firstName} {item.lastName}{" "}
                  </span>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>

        <div className="floor_b">
          <h2>Floor B</h2>
          <span className="inp_container">
            <input
              type="checkbox"
              className="chkTeacher"
              value="all"
              name="b"
              onChange={(e) => handleClick(e.target.name, e.target.checked)}
            />{" "}
            Select All{" "}
          </span>
          <hr />
          <br />

          {teachers.map((item) => {
            if (item.floorName === "b") {
              return (
                <div className="teachers">
                  <span className="inp_container">
                    <input
                      disabled={item._id === teacherId ? true : false}
                      type="checkbox"
                      className="chkTeacher b"
                      value={item._id}
                    />{" "}
                    {item.firstName} {item.lastName}{" "}
                  </span>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>

        <div className="floor_c">
          <h2>Floor C</h2>
          <span className="inp_container">
            <input
              type="checkbox"
              className="chkTeacher"
              value="all"
              name="c"
              onChange={(e) => handleClick(e.target.name, e.target.checked)}
            />{" "}
            Select All{" "}
          </span>
          <hr />
          <br />

          {teachers.map((item) => {
            if (item.floorName === "c") {
              return (
                <div className="teachers">
                  <span className="inp_container">
                    <input
                      disabled={item._id === teacherId ? true : false}
                      type="checkbox"
                      className="chkTeacher c"
                      value={item._id}
                    />{" "}
                    {item.firstName} {item.lastName}{" "}
                  </span>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>

        <div className="floor_d">
          <h2>Floor D</h2>
          <span className="inp_container">
            <input
              type="checkbox"
              className="chkTeacher"
              value="all"
              name="d"
              onChange={(e) => handleClick(e.target.name, e.target.checked)}
            />{" "}
            Select All{" "}
          </span>
          <hr />
          <br />

          {teachers.map((item) => {
            if (item.floorName === "d") {
              return (
                <div className="teachers">
                  <span className="inp_container">
                    <input
                      disabled={item._id === teacherId ? true : false}
                      type="checkbox"
                      className="chkTeacher d"
                      value="all"
                    />{" "}
                    {item.firstName} {item.lastName}{" "}
                  </span>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>

      <button onClick={shuffleStudent}>Shuffle Students</button>
      <button onClick={()=> navigate("/adminPanel")}>CANCEL</button>

    </div>
  );
}
