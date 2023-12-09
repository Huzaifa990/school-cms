import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import edit from "../images/edit.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useReducer } from "react";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

export default function TeachersDashboard() {

  var [panelName, setPanelName] = useState("teachersPanel");

  return (
    <>
      <div className="admin_tabs">
        <button
          className={panelName === "teachersPanel" ? "tabs selected" : "tabs"}
          onClick={() => setPanelName("teachersPanel")}
        >
          {" "}
          Teacher Panel{" "}
        </button>
        <button
          className={panelName === "studentsPanel" ? "tabs selected" : "tabs"}
          onClick={() => setPanelName("studentsPanel")}
        >
          {" "}
          Shuffle Students Panel{" "}
        </button>
      </div>

      {panelName === "teachersPanel" ? (
        <>
          <div className="periodData-container">
            <PeriodData />
          </div>
        </>
      ) : (
        <>
          <div className="shuffleStudents-container">
          <ShuffleStudents />
          </div>
        </>
      )}
    </>
  );
}

// =====================================================//

function ShuffleStudents() {
  var [shuffleArray, setShuffleArray] = useState([]);
  var id = localStorage.getItem("user-id");
  var [showEditBtn, setShowEditBtn] = useState(false);
  var teacherName = localStorage.getItem("cms-userName");
  var [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    async function getData() {
      var response3 = await fetch(
        "http://localhost:8080/shuffleStudents/" + id
      );
      var data3 = await response3.json();
      console.log(data3);
      setShuffleArray(data3);
    }

    getData();
  }, [ignored, id]);

  function attendance(studentId, status, periodNumber, studentName) {
    var date = new Date();

    var payload = {
      status,
    };

    axios
      .put(`http://localhost:8080/attendance/${id}/${studentId}`, payload)
      .then(() => {
        setShowEditBtn(false);
        var payload2 = {
          studentName: studentName,
          teacherName: teacherName,
          attendanceStatus: status,
          periodNumber: periodNumber,
          date:
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate(),
          studentId,
        };
        axios
          .post("http://localhost:8080/attendanceData", payload2)
          .then(() => {
            NotificationManager.success("Attendance Marked Successfully!");
          })
          .catch((e) => {
            NotificationManager.error(
              "Something went wrong! Could not save student's data."
            );
            console.log(e);
          });
      })
      .catch((e) => {
        NotificationManager.error(
          "Something went wrong! Attendance was not marked."
        );
        console.log(e);
      });

    forceUpdate();
  }

  var pNum = 0;
  var j = 0;
  return (
    <>
      <h1>Shuffle Students: </h1>
      <br />
      <br />
      
      {shuffleArray.length > 0?
      <>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Sr#</th>
              <th>Student Name</th>
              <th>Period</th>
              <th className="attendance-th">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {shuffleArray.map((item) => {
              pNum = item.periodNumber;
              return (
                <>
                  {item?.names.map((data) => {
                    j++;
                    return (
                      <tr>
                        <td>{j}</td>
                        <td>{data.studentName}</td>
                        <td>{pNum}</td>
                        {data.attendance === "empty" ? (
                          <td className="attendance-td">
                            <button
                              className="attendance-btn"
                              onClick={() =>
                                attendance(
                                  data._id,
                                  "present",
                                  item.periodNumber,
                                  data.studentName
                                )
                              }
                            >
                              Present
                            </button>
                            <button
                              className="attendance-btn"
                              onClick={() =>
                                attendance(
                                  data._id,
                                  "absent",
                                  item.periodNumber,
                                  data.studentName
                                )
                              }
                              style={{
                                backgroundColor: "crimson",
                                border: "3px solid crimson",
                              }}
                            >
                              Absent
                            </button>
                          </td>
                        ) : (
                          <td
                            className="attendance-td-new"
                            style={{
                              color:
                                data.attendance === "present"
                                  ? "#74BD43"
                                  : "crimson",
                            }}
                          >
                            {" "}
                            <span className="attendance-wrapper">
                              {data.attendance.toUpperCase()}{" "}
                              <img
                                src={edit}
                                alt="edit"
                                width={20}
                                onClick={() => setShowEditBtn(true)}
                              />
                            </span>
                            {showEditBtn === true ? (
                              <>
                                <span className="attendance-btn-container">
                                  <button
                                    className="attendance-btn"
                                    onClick={() =>
                                      attendance(
                                        data._id,
                                        "present",
                                        item.periodNumber,
                                        data.studentName
                                      )
                                    }
                                  >
                                    Present
                                  </button>
                                  <button
                                    className="attendance-btn"
                                    onClick={() =>
                                      attendance(
                                        data._id,
                                        "absent",
                                        item.periodNumber,
                                        data.studentName
                                      )
                                    }
                                    style={{
                                      backgroundColor: "crimson",
                                      border: "3px solid crimson",
                                    }}
                                  >
                                    Absent
                                  </button>
                                </span>
                              </>
                            ) : null}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </>
              );
            })}
          </tbody>
        </table>
      </>:
      
      <>
        <hr/>
        <center>
          <h1 className="empty-heading">No Shuffle Students Found!</h1>
        </center>
      </>}


    </>
  );
}

function PeriodData() {
  var [finalPeriods, setFinalPeriods] = useState([]);
  var [periodInfo, setPeriodInfo] = useState({});

  var id = localStorage.getItem("user-id");

  var [periodNumber, setPeriodNumber] = useState(0);
  var [grade, setGrade] = useState(0);

  var navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      var response = await fetch("http://localhost:8080/confPeriods/" + id);
      var data = await response.json();
      console.log(data);
      var periodNumbers = [1, 2, 3, 4, 5, 6, 7];

      var finalPeriodNumbers = periodNumbers.filter(
        (number) => !data.includes(number)
      );
      console.log(finalPeriodNumbers);
      setFinalPeriods(finalPeriodNumbers);

      if (periodNumber === 0) {
        setPeriodNumber(finalPeriodNumbers[0]);
      }

      var response2 = await fetch(
        `http://localhost:8080/periodInfo/${id}/${periodNumber}`
      );
      var data2 = await response2.json();
      console.log(data2);
      setGrade(data2.periodGrade);
      setPeriodInfo(data2);
    }

    getData();
  }, [id, periodNumber]);
  var i = 0;

  function periodData(e) {
    setPeriodNumber(e.target.value);
  }

  function editInfo(pNumber) {
    navigate("/editPeriodInfo", { state: { periodNumber: pNumber } });
  }

  return (
    <>
      <div>
        <NotificationContainer />
        <div className="table-container">
          <h1>Class Information:</h1>
          <div className="tabs">
            {finalPeriods.map((item) => {
              return (
                <button
                  className="tab"
                  id={periodNumber === item ? "active" : "notActive"}
                  value={item}
                  onClick={periodData}
                >
                  {" "}
                  Period {item}{" "}
                </button>
              );
            })}
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Sr#</th>
                <th>Student Name</th>
                <th>Grade</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {periodInfo.studentNames?.map((item) => {
                i++;
                return (
                  <tr>
                    <td>{i}</td>
                    <td>{item}</td>
                    <td>{grade}</td>
                    <td>
                      <img
                        src={edit}
                        alt="edit"
                        width={30}
                        style={{ cursor: "pointer" }}
                        onClick={() => editInfo(periodInfo.periodNumber)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <br />
        </div>
      </div>
    </>
  );
}
