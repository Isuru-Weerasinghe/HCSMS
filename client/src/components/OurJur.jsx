const OurJur = () => {
  return (
    <div className="py-5 px-20 ">
      <div className="flex p-10">
        <div className="w-[60%]">
          <div>
            <h1 className="text-4xl font-bold text-green-800">
            Welcome to Our  ENT Clinic
            </h1>
            <p className="mt-2 font-bold text-green-800">
              We provide the best health care services
            </p>
          </div>
          <p className="text-wrap text-justify mt-10 text-gray-800 ">
          At our state-of-the-art ENT Clinic, we are dedicated to providing the highest quality
           care for all your ear, nose, and throat needs. Our experienced team of specialists is
            committed to diagnosing and treating a wide range of ENT conditions with compassion 
            and expertise. Whether you are dealing with hearing loss, sinus issues, throat disorders,
             or any other related concerns, our clinic offers personalized treatment plans to ensure
              your optimal health and well-being.<br/><br/>



Patient comfort and satisfaction are our top priorities. From the moment you walk through our 
doors, you will be greeted by our friendly staff and treated with the utmost respect and care.
 We strive to create a welcoming and supportive environment where you feel heard and understood.
  Trust us to deliver exceptional care in a comfortable and friendly setting. Welcome to better 
  hearing, breathing, and living!
          </p>
        </div>
        <div className="grow ml-20 mr-10 ">
          <img
            src="https://d3b6u46udi9ohd.cloudfront.net/wp-content/uploads/2023/03/22103615/ENT-1.jpg"
            alt="doctor"
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};
export default OurJur;
