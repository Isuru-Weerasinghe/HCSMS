import React from "react";
import "../css/footer.css";
import { FaEnvelope, FaArrowRight, FaFacebook, FaInstagram, FaTwitter, FaGoogle, FaSkype } from "react-icons/fa"; 
import newLogo from '../assets/newLogo.jpg';

const Footer = () => {
  return (
    <footer>
      <div className="row footer-container">
        <div className="foot">
            <img src={newLogo} className="logo" alt="Logo" />
          <p>...Welcome to ENT Clinic Kolonna Hospital...</p>
        </div>

        <div className="foot">
          <h3>
            Address <div className="underline"><span></span></div>
          </h3>
          <p>Kolonna Base Hospital</p>
          <p>Kolonna, Ambilipitiya, Sri Lanka</p>
          <p className="email-id">kolonnabase@gmail.com</p>
          <h4>+94 70 536 1547</h4>
        </div>

        <div className="foot">
          <h3>
            Main Pages <div className="underline"><span></span></div>
          </h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Facilites</a></li>
            
          </ul>
        </div>

        <div className="foot">
          <h3>
            Contact us <div className="underline"><span></span></div>
          </h3>
         
          <div className="icons">
            <a href="#"><FaFacebook /></a><br></br>
            <a href="#"><FaInstagram /></a><br></br>
            <a href="#"><FaTwitter /></a><br></br>
            <a href="#"><FaGoogle /></a><br></br>
            
          </div>
        </div>
      </div>
      <hr />
      <p className="copyright">
        @Copyright 2024 - ENT Clinic. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

