import axios from 'axios';
import React from 'react'
import {
	NotificationContainer,
	NotificationManager,
  } from "react-notifications";
  import "react-notifications/lib/notifications.css";

import { useNavigate } from 'react-router-dom';

export default function TeacherInfo() {

	var navigate = useNavigate();

	var id = localStorage.getItem("user-id");

	function conferenceNumber(){
		var num = document.getElementById("conferenceNumber").value;
		
		document.getElementById("conf-period").innerHTML = "";

		for(var i = 0; i < num; i++){
			var input = document.createElement("input");
			input.type = "text";
			input.placeholder = "Conference Period Number: ";
			input.min = 1;
			input.max = 7;
			input.classList.add("form-control");
			input.classList.add("periodNumber");

			document.getElementById("conf-period").appendChild(input);
		}
	}

	function addInfo(e){
		e.preventDefault();

		var floors = document.getElementById("floors");
		var floorName = floors[floors.selectedIndex].value;
		var roomNumber = document.getElementById("roomNumber").value;
		var conferenceNumber = document.getElementById("conferenceNumber").value;
		var periodNumber = document.getElementsByClassName("periodNumber");

		var conferencePeriods = [];

		for(var i = 0; i < periodNumber.length; i++){
			if(periodNumber[i].value !== ""){
				conferencePeriods.push(periodNumber[i].value);
			}
			else{
				NotificationManager.error("Period Information Filled Incorrectly!");
				return;
			}
		}

		var payload = {
			floorName,
			roomNumber,
			conferenceNumber,
			conferencePeriods
		}

		axios.put("http://localhost:8080/teacherinfo/"+id, payload).then((res)=>{
			console.log(res);
			NotificationManager.success("Data Added!");
			navigate("/periodInfo", {state: {periods: res.data.conferencePeriods}});
		}).catch((e)=>{
			NotificationManager.error("User not found!");
			console.log(e);
		});
	}

  return (
    <div className='addinfo-container'>
		<NotificationContainer/>
        <div className="wrapper">
			<div className="inner inner-form" style={{width:"80%"}}>
				<form action="" style={{width:"100%"}} onSubmit={addInfo}>
					<h3>Teacher Infomation</h3>
                    <div className='form-wrapper'>
                        <label>Choose your floor name: </label>
                        <select name='floors' id='floors'>
                            <option value="b"> B </option>
                            <option value="c"> C </option>
                            <option value="d"> D </option>
                            <option value="g"> G </option>
                            <option value="h"> H </option>        
                        </select>
                    </div>
                    <br/> <br/>
					<div className="form-wrapper">
						<input type="number" placeholder="Room Number e.g 123" className="form-control" id='roomNumber'/>
						<i className="zmdi zmdi-email"></i>
					</div>
					
					<div className="form-wrapper">
						<input type="number" placeholder="Conferences Per Day" className="form-control" id='conferenceNumber' onChange={conferenceNumber}/>
						<i className="zmdi zmdi-lock"></i>
					</div>

					<div className='form-wrapper' id='conf-period'></div>

					<div className='btn-container'>
						<button type='submit'>Next 
							<i className="fas fa-arrow-right"></i>
						</button>
					</div>
					
					<br/>
				</form>
			</div>
		</div>
    </div>
  )
}
