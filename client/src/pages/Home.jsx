import { IoChatboxEllipsesOutline } from "react-icons/io5";
import AboutUs from "../components/AboutUs";
import CardView from "../components/CardView";
import ContactUs from "../components/ContactUs";
import Review from "../components/Feedback";
import NavBar from "../components/NavBar";
import OurJur from "../components/OurJur";
import Footer from "../components/Footer";
import { useState, useRef, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import Facilities from "../components/Facilities";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [chatIconClick, setChatIconClick] = useState(false);
  const [messagesList, setMessagesList] = useState([
    { owner: "p", message: "How can I help you?" },
  ]);
  const chatInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const chatClick = () => {
    setChatIconClick(!chatIconClick);
  };

  const getResponse = async (query) => {
    await axios
      .post("http://localhost:5000/bot", { query: query })
      .then((response) => {
        const data = response.data.response;

        let message;
        if (data.status === "found") {
          message = data.response;
        } else if (data.status === "not found") {
          message = "Not Found!";
        } else if (data.status === "error") {
          message = "Server Error!";
        } else {
          message = "Error!";
        }

        setMessagesList((prevMessagesList) => [
          ...prevMessagesList,
          { owner: "u", message: query },
          { owner: "p", message: message },
        ]);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatIconClick) {
      scrollToBottom();
    }
  }, [messagesList, chatIconClick]);

  return (
    <div className="w-full relative">
      <div
        className="fixed bottom-10 right-10 bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 p-3 rounded-full hover:bg-gradient-to-r hover:from-green-600 hover:via-teal-700 hover:to-blue-600 cursor-pointer shadow-lg transition-all duration-300 ease-in-out"
        onClick={() => {
          chatClick();
        }}
      >
        <IoChatboxEllipsesOutline size={32} className="text-white" />
      </div>
      {chatIconClick && (
        <div className="fixed bottom-24 right-10 flex flex-col bg-white rounded-lg border border-gray-200 shadow-xl h-[400px] w-[350px] z-10">
          <div className="flex flex-col gap-2">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-t-lg">
              <h1 className="text-white text-lg text-center font-semibold">
                Chat Bot
              </h1>
            </div>
            <div
              className="p-3 gap-3 flex flex-col overflow-y-auto"
              style={{ maxHeight: "285px" }}
            >
              {messagesList.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.owner === "u"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >
                  <p
                    className={
                      message.owner === "u"
                        ? "bg-green-100 p-3 rounded-xl text-sm shadow-sm"
                        : "bg-gray-100 p-3 rounded-xl text-sm shadow-sm"
                    }
                    style={{ maxWidth: "75%" }}
                  >
                    {message.message}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-3 flex items-center mt-auto">
            <input
              ref={chatInputRef}
              className="w-full h-10 border border-gray-300 rounded-full px-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={() => {
                let value = chatInputRef.current.value;
                if (value.length > 0) {
                  getResponse(value);
                  chatInputRef.current.value = "";
                }
              }}
              className="ml-3 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-full px-4 py-2 hover:from-teal-600 hover:to-blue-600 transition-all duration-300"
            >
              Send
            </button>
          </div>
        </div>
      )}
      <NavBar />
      <div id="home" className="relative">
        <img
          src="https://cpsnb.org/images/slideshow/cpsnb_slide3.jpg"
          alt="main"
          className="h-[600px] min-w-[100%] opacity-95"
        />
        <div className="absolute top-[35%] left-[10%] flex flex-col gap-5">
          <h1 className="text-4xl font-bold text-gray-500 w-[400px]">
            Welcome to Kolonna Base Hospital
          </h1>
          <p className="text-gray-500">We provide the best health care services</p>
          <button className="w-[200px] bg-transparent border border-gray-500 text-gray-500 px-5 py-2 rounded-md">
            <ScrollLink
              to="facilities"
              smooth={true}
              duration={500}
              className="p-2 cursor-pointer hover:text-green-600 text-gray-700 text-sm transition duration-200 ease-in-out"
            >
              Our Services
            </ScrollLink>
          </button>
        </div>
      </div>
      <OurJur />
      <CardView />
      <Facilities />
      <AboutUs />
      <div className="py-1 px-32 mt-10">
        <h1 className="text-4xl font-bold text-green-800 text-center">
          Feedback
        </h1>
      </div>
      <div className="flex w-full items-center justify-center p-4">
        <div className="container">
          <Review />
        </div>
      </div>
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Home;
