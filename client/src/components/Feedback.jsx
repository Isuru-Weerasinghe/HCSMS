import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaQuoteRight } from "react-icons/fa";

const Review = () => {
  const [index, setIndex] = useState(0);
  const [feedbackData, setFeedback] = useState([]);
  const [fadeClass, setFadeClass] = useState("opacity-100 translate-x-0"); // Initial state for animation

  // Fetch feedback data
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("http://localhost:5000/feedback"); // API to fetch feedback data
        const data = await response.json();
        setFeedback(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };
    fetchFeedback();
  }, []);

  // Function to check valid index
  const checkNumber = (number) => {
    if (number > feedbackData.length - 1) {
      return 0;
    } else if (number < 0) {
      return feedbackData.length - 1;
    }
    return number;
  };

  // Next feedback with animation
  const nextPerson = () => {
    setFadeClass("opacity-0 -translate-x-10"); // Start exit animation
    setTimeout(() => {
      setIndex((index) => {
        let newIndex = index + 1;
        return checkNumber(newIndex);
      });
      setFadeClass("opacity-100 translate-x-0"); // Start enter animation
    }, 300); // Delay between exit and entering feedback
  };

  // Previous feedback with animation
  const prevPerson = () => {
    setFadeClass("opacity-0 translate-x-10"); // Start exit animation
    setTimeout(() => {
      setIndex((index) => {
        let newIndex = index - 1;
        return checkNumber(newIndex);
      });
      setFadeClass("opacity-100 translate-x-0"); // Start enter animation
    }, 300); // Delay between exit and entering feedback
  };

  // Automatically move to the next feedback every 3 seconds
  useEffect(() => {
    const slider = setInterval(() => {
      nextPerson();
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(slider); // Clear the interval when component unmounts
  }, [index]);

  // Return loading if feedback data is not fetched yet
  if (feedbackData.length === 0) {
    return <p>Loading...</p>;
  }

  const { image, username, feedback } = feedbackData[index]; // Get current feedback

  return (
    <div className="bg-blue-100 rounded-lg flex items-center justify-center min-h-[60vh]">
      <article
        className={`relative bg-white rounded-lg p-5 shadow-lg max-w-3xl text-center transform transition-all duration-300 ease-in-out ${fadeClass}`}
      >
        {/* Arrow Buttons */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-400 mx-2"
          onClick={prevPerson}
        >
          <FaChevronLeft />
        </button>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-400 mx-2"
          onClick={nextPerson}
        >
          <FaChevronRight />
        </button>

        {/* User Image */}
        <div className="flex justify-center mb-4">
          <img
            src={image}
            alt={username}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
          />
        </div>

        {/* Feedback Content */}
        <p className="text-gray-600 italic mb-2">{feedback}</p>

        {/* Quote Icon */}
        <div className="flex justify-center text-blue-600 text-2xl mb-1">
          <FaQuoteRight />
        </div>

        {/* Username */}
        <h4 className="text-lg font-semibold">{username}</h4>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-2">
          {feedbackData.map((_, feedbackIndex) => (
            <span
              key={feedbackIndex}
              className={`mx-1 w-2 h-2 rounded-full ${
                feedbackIndex === index ? "bg-gray-800" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </article>
    </div>
  );
};

export default Review;
