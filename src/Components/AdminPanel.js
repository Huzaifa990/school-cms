import React, { useEffect, useState } from "react";
import absent from "../images/absent-2.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useReducer } from "react";

export default function AdminPanel() {
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
          Student Panel{" "}
        </button>

        <button
          className={
            panelName === "shuffleStudentsData" ? "tabs selected" : "tabs"
          }
          onClick={() => setPanelName("shuffleStudentsData")}
        >
          {" "}
          Shuffle Students{" "}
        </button>
      </div>

      {panelName === "teachersPanel" ? (
        <>
          <TeachersPanel />
        </>
      ) : panelName === "studentsPanel" ? (
        <>
          <StudentsPanel />
        </>
      ) : (
        <>
          <ShuffleStudentData />
        </>
      )}
    </>
  );
}

function StudentsPanel() {
  var [students, setStudents] = useState([]);
  var date = new Date();
  var formattedDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  console.log(formattedDate);
  useEffect(() => {
    async function getData() {
      try {
        var response = await fetch(
          "http://localhost:8080/shuffleAttendance/" + formattedDate
        );
        var data = await response.json();
        console.log(data);

        setStudents(data);
      } catch (e) {
        console.log(e);
      }
    }

    getData();
  }, [formattedDate]);
  var i = 0;

  async function getDate(val) {
    var response = await fetch(
      "http://localhost:8080/shuffleAttendance/" + val
    );
    var data = await response.json();
    console.log(data);

    setStudents(data);

    console.log(new Date().toISOString());
  }
  return (
    <div>
      <div className="table-container admin-table">
        <div className="student-admin">
          <h1>Students Information:</h1>
          <input
            type="date"
            id="date"
            onChange={(e) => getDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
        <br />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Sr#</th>
              <th>Student Name</th>
              <th>Teacher Name</th>
              <th>Period Assigned</th>
              <th>Date</th>
              <th style={{ textAlign: "center" }}>Attendance</th>
            </tr>
          </thead>

          {students.length > 0 ? (
            <>
              <tbody>
                {students?.map((item) => {
                  i++;
                  return (
                    <tr>
                      <td>{i}</td>
                      <td>{item.studentName}</td>
                      <td>{item.teacherName}</td>
                      <td> {item.periodNumber} </td>
                      <td>{item.date}</td>
                      <td style={{ textAlign: "center" }}>
                        {item.attendanceStatus}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </>
          ) : (
            <>
              <div className="emptyHeadingContainer">
                <h1 className="empty-heading">No Data Found!</h1>
              </div>
            </>
          )}
        </table>
      </div>
    </div>
  );
}

function TeachersPanel() {
  var navigate = useNavigate();
  var [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  var [teachers, setTeachers] = useState([]);

  useEffect(() => {
    async function getData() {
      var response = await fetch("http://localhost:8080/teachers");
      var data = await response.json();
      console.log(data);

      setTeachers(data);
    }

    getData();
  }, [ignored]);

  var i = 0;

  function shuffleStudents(id) {
    navigate("/shuffle", { state: { teacherId: id } });
  }

  function resetAll() {
    axios
      .delete("http://localhost:8080/resetAllAttendance")
      .then(() => {
        NotificationManager.success("Attendance Reset Successful!");
        closePopup();
        forceUpdate();
      })
      .catch((e) => {
        NotificationManager.error("Something went wrong!");
        console.log(e);
      });

    forceUpdate();
  }

  function showPopup() {
    document.getElementById("popUp").style.visibility = "visible";
  }

  function closePopup() {
    document.getElementById("popUp").style.visibility = "hidden";
  }
  return (
    <div>
      <NotificationContainer />
      <div className="table-container admin-table">
        <div className="teacher-admin">
          <h1>Teacher Information:</h1>

          <button onClick={showPopup}>Reset All Attendance Data</button>
        </div>

        <br />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Sr#</th>
              <th>Teacher Name</th>
              <th>Room Number</th>
              <th>Floor</th>
              <th>Email</th>
              <th style={{ textAlign: "center" }}>Mark Absent</th>
            </tr>
          </thead>
          <tbody>
            {teachers?.map((item) => {
              if (item.absentStatus !== true) {
                i++;
                return (
                  <tr>
                    <td>{i}</td>
                    <td>
                      {item.firstName} {item.lastName}
                    </td>
                    <td>{item.roomNumber}</td>
                    <td> {item.floorName.toUpperCase()} </td>
                    <td>{item.email}</td>
                    <td style={{ textAlign: "center", cursor: "pointer" }}>
                      <img
                        src={absent}
                        alt="absent"
                        width={40}
                        onClick={() => shuffleStudents(item._id)}
                      />
                    </td>
                  </tr>
                );
              } else {
                return null;
              }
            })}
          </tbody>
        </table>
      </div>
      <div className="overlay">
        <div className="pop-up" id="popUp">
          <h1>Are you sure you want to reset all data?</h1>
          <p>
            This action will delete all the shuffle data records, please click
            on confirm to proceed with this action.
          </p>
          <div className="popUp-btn-container">
            <button className="confirm-popup" onClick={resetAll}>
              Confirm
            </button>
            <button className="cancel-popup" onClick={closePopup}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShuffleStudentData() {
  var [shuffleData, setShuffleData] = useState([]);
  var [teachersData, setTeachersData] = useState([]);
  var [panelName, setPanelName] = useState("");
  var [floorNames, setFloorNames] = useState([]);

  useEffect(() => {
    async function getData() {
      var res2 = await fetch(
        "http://localhost:8080/allShuffleStudentsTeachers"
      );
      var data2 = await res2.json();
      console.log(data2);
      setTeachersData(data2.filteredStudents);
      setFloorNames(data2.floorsDetected);
      setPanelName(
        `${data2.filteredStudents[0].firstName};${data2.filteredStudents[0].lastName}`
      );
    }

    getData();
  }, []);

  useEffect(() => {
    async function getPanelName() {
      var response = await fetch(
        "http://localhost:8080/allShuffleStudents/" + panelName
      );
      var data = await response.json();
      console.log(data);
      setShuffleData(data);
    }

    getPanelName();
  }, [panelName]);
  var i = 0;
  return (
    <div>
      <div>
        <NotificationContainer />

        {floorNames.length > 0 ? (
          <>
            {floorNames.map((fName) => {
              return (
                <>
                  <h2>Students on floor {fName.toUpperCase()}</h2>
                  <div className="admin_tabs">
                    {teachersData.map((tName) => {
                      return (
                        <button
                          className={
                            panelName === `${tName.firstName};${tName.lastName}`
                              ? "tabs selected"
                              : "tabs"
                          }
                          onClick={() =>
                            setPanelName(`${tName.firstName};${tName.lastName}`)
                          }
                        >
                          {tName.firstName} {tName.lastName}
                        </button>
                      );
                    })}
                  </div>

                  <div className="table-container admin-table">
                    <div className="teacher-admin">
                      <h1>Shuffled Students Information:</h1>
                    </div>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Sr#</th>
                          <th>Teacher Name</th>
                          <th>Room Number</th>
                          <th>Floor</th>
                          <th>Student Name</th>
                          <th>Period Number</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shuffleData.map((item) => {
                          const firstName = item.firstName;
                          const lastName = item.lastName;
                          const floorName = item.floorName;
                          const roomNumber = item.roomNumber;
                          return (
                            <>
                              {item?.shuffleStudents.map((students) => {
                                const pNum = students.periodNumber;
                                return (
                                  <>
                                    {students.names.map((name) => {
                                      i++;
                                      return (
                                        <>
                                          <tr>
                                            <td>{i}</td>
                                            <td>
                                              {firstName + " " + lastName}
                                            </td>
                                            <td>{roomNumber}</td>
                                            <td>{floorName}</td>
                                            <td>{name.studentName}</td>
                                            <td>{pNum}</td>
                                          </tr>
                                        </>
                                      );
                                    })}
                                  </>
                                );
                              })}
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })}
          </>
        ) : (
          <>
            <div className="emptyHeadingContainer emptyAdminShuffle">
              <h1>No Data Found!</h1>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
