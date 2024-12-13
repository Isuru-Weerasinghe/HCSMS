import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import toast from "react-hot-toast";

const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_ww9j9kk', 'template_dn076dm', form.current, 'BnBCEZsiLU35Ijln7')
      .then(
        () => {
          console.log('SUCCESS!');
          toast.success('Message has been sent successfully!');
          form.current.reset();
        },
        (error) => {
          console.log('FAILED...', error.text);
          toast.error('Message failed to send. Please try again.');
        }
      );
  };

  return (
    <div id="contact" className="bg-green-700">
      <div className="py-5 px-32 flex">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white">Contact Us</h1>
          <p className="mt-2 font-bold text-white">
            We provide the best health care services
          </p>
          <form ref={form} onSubmit={sendEmail} className="flex flex-col mt-5">
            <input
              type="text"
              name="from_name"
              placeholder="Name"
              className="w-[400px] h-[40px] mt-5 rounded-md p-2"
              required
            />
            <input
              type="email"
              name="user_email"
              placeholder="Email"
              className="w-[400px] h-[40px] mt-5 rounded-md p-2"
              required
            />
            <textarea
              name="message"
              placeholder="Message"
              className="w-[400px] h-[100px] mt-5 rounded-md p-2"
              required
            ></textarea>
            <button
              type="submit"
              className="w-[200px] bg-white text-green-500 mt-5 px-5 py-2 rounded-md"
            >
              Send Message
            </button>
          </form>
        </div>
        <div className="flex-1">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.649872646381!2d80.81456441491352!3d6.421687995352222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae33b9be8577e97%3A0x499f19cf8d73665!2sKolonna%20Base%20Hospital!5e0!3m2!1sen!2slk!4v1626339284547!5m2!1sen!2slk"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Kolonna Base Hospital"
            className="w-full h-[400px] object-cover rounded-lg mt-10"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
