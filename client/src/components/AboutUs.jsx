import { FcAbout } from "react-icons/fc";

const AboutUs = () => {
  return (
    <div
      id="about"
      className="py-12 px-32 mt-10 flex items-center justify-center"
    >
      <div className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-md border border-gray-300 rounded-xl shadow-2xl w-full max-w-7xl p-10">
        <h1 className="text-4xl font-bold text-green-800 mb-5 text-center">About Us</h1>
        <div className="flex">
          <div className="flex-1 gap-5 flex flex-col">
            <div className="flex gap-5 items-center">
              <FcAbout className="w-16 h-16" />
              <div>
                <h2 className="text-xl font-bold mt-2 text-black">Our Mission</h2>
                <p className="mt-2">
                  Our mission is to provide exceptional ear, nose, and throat care to our patients with compassion and dedication.
                </p>
              </div>
            </div>
            <div className="flex gap-5 items-center">
              <FcAbout className="w-16 h-16" />
              <div>
                <h2 className="text-xl font-bold mt-2 text-black">Our Vision</h2>
                <p className="mt-2">
                  Our vision is to be a leading ENT clinic known for excellence in patient care, cutting-edge treatments, and a holistic approach to health.
                </p>
              </div>
            </div>
            <div className="flex gap-5 items-center">
              <FcAbout className="w-16 h-16" />
              <div>
                <h2 className="text-xl font-bold mt-2 text-black">Our Aim</h2>
                <p className="mt-2">
                  We aim to continuously advance the field of otolaryngology through research, education, and a commitment to quality healthcare.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center ml-10">
            <img
              src="https://www.ninewellshospital.lk/wp-content/uploads/2018/06/icu-thumb.jpg"
              alt="doctor"
              className="w-[420px] h-[320px] object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
