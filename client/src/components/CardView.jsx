import { PiLayout } from "react-icons/pi";

const CardView = () => {
  return (
    <div className="py-5 px-32 ">
      <h1 className="text-4xl font-bold text-green-800 mb-10">Our Doctors</h1>
      <div className="grid grid-cols-3 grid-rows-2 gap-10">
        {/* Doctor 1 */}
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-gray-300 p-5 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex">
            <PiLayout className="w-12 h-12 text-green-800" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mt-1">
            Dr. Kamal Bandara
          </h1>
          <p className="text-gray-800 mt-5 mr-5 text-justify">
            Dr. Kamal Bandara is a renowned otolaryngologist specializing in treating ear infections, hearing loss, and balance disorders. With over 20 years of experience, he is dedicated to providing comprehensive ear care.
          </p>
        </div>

        {/* Doctor 2 */}
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-gray-300 p-5 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex">
            <PiLayout className="w-12 h-12 text-green-800" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mt-1">
            Dr. Maneesha Wanniarachchi
          </h1>
          <p className="text-gray-800 mt-5 mr-5 text-justify">
            Dr. Maneesha Wanniarachchi specializes in rhinology and provides expert care for patients suffering from chronic sinusitis, nasal polyps, and other nasal disorders. She is known for her patient-centered approach and advanced treatment methods.
          </p>
        </div>

        {/* Doctor 3 */}
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-gray-300 p-5 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex">
            <PiLayout className="w-12 h-12 text-green-800" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mt-1">
            Dr. Nimal Premasiri
          </h1>
          <p className="text-gray-800 mt-5 mr-5 text-justify">
            Dr. Nimal Premasiri is a laryngologist with expertise in voice disorders, vocal cord nodules, and throat cancers. He is dedicated to helping patients regain their voice and improve their quality of life through innovative treatments.
          </p>
        </div>

        {/* Doctor 4 */}
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-gray-300 p-5 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex">
            <PiLayout className="w-12 h-12 text-green-800" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mt-1">
            Dr. Manel Upendra
          </h1>
          <p className="text-gray-800 mt-5 mr-5 text-justify">
            Dr. Manel Upendra is an expert in pediatric ENT, providing specialized care for children with ear, nose, and throat conditions. Her gentle approach and dedication to young patients make her a trusted choice for parents.
          </p>
        </div>

        {/* Doctor 5 */}
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-gray-300 p-5 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex">
            <PiLayout className="w-12 h-12 text-green-800" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mt-1">
            Dr. Nalin Gunasekara
          </h1>
          <p className="text-gray-800 mt-5 mr-5 text-justify">
            Dr. Nalin Gunasekara is a facial plastic surgeon specializing in reconstructive and cosmetic surgery of the head and neck. His expertise includes rhinoplasty, facelifts, and reconstructive surgery following trauma or cancer treatment.
          </p>
        </div>

        {/* Doctor 6 */}
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-gray-300 p-5 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex">
            <PiLayout className="w-12 h-12 text-green-800" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mt-1">
            Dr. Kithsiri Bandara
          </h1>
          <p className="text-gray-800 mt-5 mr-5 text-justify">
            Dr. Kithsiri Bandara is a specialist in sleep medicine and treats conditions such as sleep apnea and snoring. She uses the latest techniques and therapies to help patients achieve better sleep and overall health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardView;
