import React from 'react'
import admin from "../images/admin.png";
import teacher from "../images/teacher.png";
import { useNavigate } from 'react-router-dom';

export default function MainSection() {
  var navigate = useNavigate();

  function redirect(){
    navigate("/signin");
  }
  return (
    <div className='main-section'>
      <div className='teacher' onClick={redirect}>
        <img src={teacher} alt='teacher' width={150}/>
        <p>I am a teacher</p>
      </div>

      <div className='admin' onClick={redirect}>
        <img src={admin} alt='admin' width={150}/>
        <p>I am an admin</p>
      </div>
    </div>
  )
}
