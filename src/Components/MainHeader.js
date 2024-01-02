import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import data from '../Config/config';

export default function MainHeader() {

  var navigate = useNavigate();

  var idCipher = localStorage.getItem("user-id");
  var accountTypeCipher = localStorage.getItem("cms-accountType");
  var adminStatusCipher = localStorage.getItem("cms-adminAccountStatus");
  
  if(idCipher){
    var bytes3  = CryptoJS.AES.decrypt(idCipher, data.secretKey);
    var id = bytes3.toString(CryptoJS.enc.Utf8);
  }
  if(accountTypeCipher){
    var bytes  = CryptoJS.AES.decrypt(accountTypeCipher, data.secretKey);
    var accountType = bytes.toString(CryptoJS.enc.Utf8);
  }

  if(adminStatusCipher){
    var bytes2  = CryptoJS.AES.decrypt(adminStatusCipher, data.secretKey);
    var adminStatus = bytes2.toString(CryptoJS.enc.Utf8);
  }



  useEffect(()=>{
    if(id){
      if(accountType === "teacher"){
        navigate("/teacherDashboard");
      }
      else if((accountType === "admin" && adminStatus !== "pending") || accountType === "superadmin"){
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
