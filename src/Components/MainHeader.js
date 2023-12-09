import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom';

export default function MainHeader() {

  var navigate = useNavigate();

  var id = localStorage.getItem("user-id");
  var accountType = localStorage.getItem("cms-accountType");


  useEffect(()=>{
    if(id){
      if(accountType === "teacher"){
        navigate("/teacherDashboard");
      }
      else if(accountType === "admin"){
        navigate("/adminPanel");
      }
    }
  }, [])
  

  return (
    <div>
      <section className="header"> 
        <Navbar/>
        <div className="text-box">
            <h1>West Lake Middle School</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit consectetur quisquam deserunt dolorum veniam,<br/> nihil maiores voluptatem sed magnam ullam ducimus, minus id placeat ratione iusto deleniti praesentium! Porro, maxime.</p>
            <a href="" className="hero-btn">Visit Us To Know More</a>
        </div>

    </section>
    </div>
  )
}
