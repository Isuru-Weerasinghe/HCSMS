import { BiUser } from "react-icons/bi";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import Logo_new from "../assets/newLogo.jpg";

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="flex justify-around h-16">
        <div className="flex gap-5 justify-center items-center font-bold text-gray-700 cursor-pointer">
          <div>
            <img src={Logo_new} alt="Doctor Icon" style={{ width: '4rem', height: '4rem' }} />
          </div>
          <div>
            <h1>Kolonna Base Hospital</h1>
          </div>
        </div>
        <div className="flex gap-5 justify-center items-center">
          <ScrollLink
            to="home"
            smooth={true}
            duration={500}
            className="p-2 cursor-pointer hover:bg-gray-200 hover:text-green-600 text-gray-700 text-sm transition duration-200 ease-in-out"
          >
            Home
          </ScrollLink>
          <ScrollLink
            to="about"
            smooth={true}
            duration={500}
            className="p-2 cursor-pointer hover:bg-gray-200 hover:text-green-600 text-gray-700 text-sm transition duration-200 ease-in-out"
          >
            About
          </ScrollLink>
          <ScrollLink
            to="contact"
            smooth={true}
            duration={500}
            className="p-2 cursor-pointer hover:bg-gray-200 hover:text-green-600 text-gray-700 text-sm transition duration-200 ease-in-out"
          >
            Contact
          </ScrollLink>
          <ScrollLink
            to="facilities"
            smooth={true}
            duration={500}
            className="p-2 cursor-pointer hover:bg-gray-200 hover:text-green-600 text-gray-700 text-sm transition duration-200 ease-in-out"
          >
            Facilities
          </ScrollLink>
        </div>
        <div className="flex gap-5 justify-center items-center">
          <RouterLink
            to="/login"
            className="flex items-center gap-2 text-gray-700 text-sm hover:text-green-600 transition duration-200 ease-in-out"
          >
            <BiUser />
            <button>Login</button>
          </RouterLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
