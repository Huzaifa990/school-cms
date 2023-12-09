import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

import { useNavigate } from "react-router-dom";

export default function PeriodInfo() {
  var id = localStorage.getItem("user-id");
  var navigate = useNavigate();

  var [i, setI] = useState(0);

  var [currentPeriod, setCurrentPeriod] = useState(0);

  var location = useLocation();
  var confPeriods = location.state.periods;
  console.log(confPeriods);

  var periodNumbers = [1, 2, 3, 4, 5, 6, 7];

  var finalPeriodNumbers = periodNumbers.filter(
    (number) => !confPeriods.includes(number)
  );
  console.log(finalPeriodNumbers);

  var periodInfo = [];

  useEffect(() => {
    setCurrentPeriod(finalPeriodNumbers[i]);

    async function getData() {
      var response = await fetch("http://localhost:8080/teacher/" + id);
      var data = await response.json();
      console.log(data);
      if (data.periodInfo.length > 0) {
        periodInfo = data.periodInfo;
      }
      console.log(data.periodInfo);
    }

    getData();

    document.getElementById("periodNumber").value =
      "Period Number: " + finalPeriodNumbers[i];
  }, [i, finalPeriodNumbers, id]);

  var count = 2;
  function addStudent() {
    var input = document.createElement("input");
    input.type = "text";
    input.classList.add("form-control");
    input.classList.add("students");
    input.placeholder = "Student " + count;
    count++;

    document.getElementById("add-std").appendChild(input);
  }

  async function addData(e) {
    e.preventDefault();

    console.log(id);

    var periodNumber = currentPeriod;
    var allStudents = document.getElementsByClassName("students");
    var studentNames = [];

    for (let i = 0; i < allStudents.length; i++) {
      studentNames.push(allStudents[i].value);
    }

    var periodGrade = parseInt(document.getElementById("grade").value);

    for(let i = 0; i < studentNames.length; i++){
      
      var studentPayload = {
        name: studentNames[i],
        grade: periodGrade
      }

      await axios.post("http://localhost:8080/students", studentPayload).then(()=>{
        console.log("Student Added!");
      }).catch((e)=>{
        console.log(e);
      })
    }

    var periodData = {
      periodNumber,
      studentNames,
      periodGrade,
    };

    periodInfo.push(periodData);

    var payload = {
      periodInfo,
    };

    axios
      .put("http://localhost:8080/teacherinfo/" + id, payload)
      .then(() => {
        NotificationManager.success("Data Added!");
        document.getElementById("period-form").reset();
        document.getElementById("add-std").innerHTML = "";
        setI((prevI) => prevI + 1);
      })
      .catch((e) => {
        NotificationManager.error("Something went wrong!");
        console.log(e);
      });
  }

  useEffect(() => {
	if (i === finalPeriodNumbers.length) {
		var payloadFinal = {
			status: "complete"
		}
		
		axios.put("http://localhost:8080/teacherinfo/"+id, payloadFinal).then(()=>{
		
			NotificationManager.success("All Data Entered!");
			navigate("/");
		
		}).catch(()=>{
		
			NotificationManager.error("Could Not Update Data!");
		
		})
	}
  }, [i, finalPeriodNumbers.length, id, navigate]);

  return (
    <div>
      <NotificationContainer />
      <div className="wrapper">
        <div className="inner" style={{ width: "100%" }}>
          <form
            action=""
            style={{ width: "100%" }}
            onSubmit={addData}
            id="period-form"
          >
            <h3>Period {currentPeriod} Information</h3>
            <div className="form-group">
              <input
                type="text"
                placeholder="Period Number"
                className="form-control"
                id="periodNumber"
                disabled
              />
              <input
                type="number"
                placeholder="Grade"
                className="form-control"
                id="grade"
              />
            </div>

            <div className="form-wrapper">
              <label>Student Names: </label>
              <br /> <br />
              <input
                type="text"
                placeholder="Student 1"
                className="form-control students"
              />
              <i className="fas fa-user"></i>
            </div>

            <div className="form-wrapper" id="add-std"></div>

            <div className="addMore-container">
              <button
                onClick={addStudent}
                type="button"
                style={{ borderRadius: "100px", height: "44px" }}
              >
                Add Student <i className="fas fa-plus"></i>{" "}
              </button>
            </div>

            <div className="btn-container">
              <button type="submit">
                NEXT
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>

            <br />
          </form>
        </div>
      </div>
    </div>
  );
}
