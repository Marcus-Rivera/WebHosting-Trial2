import React, { useState } from "react";
import bg from './assets/BG.png';
import { FaBars, FaTimes, FaFacebookF, FaInstagram } from "react-icons/fa";

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-yellow-300 rounded-lg shadow-lg p-6 w-[90%] max-w-3xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black text-xl cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-[#272343]">Contact Us</h2>

        {/* Flex Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Form */}
          <form className="space-y-3">
            <input
              type="text"
              placeholder="Fullname"
              className="w-full px-3 py-2 border rounded-md focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none"
            />
            <textarea
              placeholder="Message"
              rows="4"
              className="w-full px-3 py-2 border rounded-md focus:outline-none"
            ></textarea>
            <button
              type="submit"
              className="w-full py-2 rounded-md bg-[#272343] text-white hover:bg-yellow-400 hover:text-black transition"
            >
              Contact Us
            </button>
          </form>

          {/* Right: Contact Info */}
          <div className="space-y-4 text-[#272343] font-semibold">
            <div>
              <p className="font-bold">Contact</p>
              <p className="text-sm">TaraTrabaho@gmail.com</p>
            </div>
            <div>
              <p className="font-bold">Based in</p>
              <p className="text-sm italic">Magsaysay Avenue, Makati</p>
            </div>
            <div>
              <p className="font-bold">Socials</p>
              <div className="flex gap-3 mt-1">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:scale-110 transition"
                >
                  <FaFacebookF size={24} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:scale-110 transition"
                >
                  <FaInstagram size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const AboutUsPage = () => {
    const [isOpen, setIsOpen] = useState(false); // mobile menu
    const [contactOpen, setContactOpen] = useState(false); // contact modals
    return (
        <div 
            className="bg-cover min-h-screen items-center justify-center flex flex-col"
            style={{ backgroundImage: `url(${bg})` }}
        >
            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 w-full bg-[#272343] text-white shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
                <h1 className="text-2xl font-bold italic">
                Tara<span className="text-yellow-400">Trabaho!</span>
                </h1>
                <ul className="hidden md:flex gap-8 font-semibold">
                <li><a href="/" className="hover:text-yellow-400">Home</a></li>
                <li><a href="/about" className="hover:text-yellow-400">About Us</a></li>
                <li>
                    <button onClick={() => setContactOpen(true)} className="hover:text-yellow-400">
                    Contact
                    </button>
                </li>
                <li><a href="/faqs" className="hover:text-yellow-400">FAQs</a></li>
                </ul>
                <button
                className="md:hidden text-2xl"
                onClick={() => setIsOpen(!isOpen)}
                >
                {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>
            {isOpen && (
                <div className="md:hidden bg-[#272343] text-white px-4 py-3 space-y-3">
                <a href="/" className="block hover:text-yellow-400">Home</a>
                <a href="/about" className="block hover:text-yellow-400">About Us</a>
                <button onClick={() => { setContactOpen(true); setIsOpen(false); }} className="block hover:text-yellow-400">
                    Contact
                </button>
                <a href="/faqs" className="block hover:text-yellow-400">FAQs</a>
                </div>
            )}
            </nav>

            

            {/* CONTACT MODAL */}
            <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
        </div>


    )

}




export default AboutUsPage;