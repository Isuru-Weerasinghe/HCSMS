import React from 'react';
import { FaXRay, FaFlask, FaPills } from 'react-icons/fa';

const Facilities = () => {
  return (
    <div id="facilities" className="py-5 px-32">
      <h1 className="text-4xl font-bold text-green-800 mb-10">Our Services</h1>
      <div className="grid grid-cols-3 gap-10">
        {/* Radiology Services */}
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-gray-300 p-5 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex">
            <FaXRay className="w-12 h-12 text-green-800" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mt-1">Radiology Services</h1>
          <p className="text-gray-800 mt-5 mr-5 text-justify">
            Our Radiology Department provides state-of-the-art imaging services, including X-rays, CT scans, and MRIs. Our skilled radiologists ensure precise and accurate diagnostics to aid in your treatment plan.
          </p>
        </div>

        {/* Laboratory Services */}
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-gray-300 p-5 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex">
            <FaFlask className="w-12 h-12 text-green-800" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mt-1">Laboratory Services</h1>
          <p className="text-gray-800 mt-5 mr-5 text-justify">
            Our Laboratory offers comprehensive testing services, from routine blood tests to advanced molecular diagnostics. We provide fast and accurate results to support your healthcare needs.
          </p>
        </div>

        {/* Pharmacy */}
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-gray-300 p-5 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex">
            <FaPills className="w-12 h-12 text-green-800" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mt-1">Pharmacy</h1>
          <p className="text-gray-800 mt-5 mr-5 text-justify">
            Our Pharmacy offers a wide range of medications and health products. Our pharmacists are available to provide advice on prescriptions and over-the-counter medications to ensure your health and well-being.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Facilities;
